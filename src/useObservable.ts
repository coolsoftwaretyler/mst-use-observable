import { useEffect, useState } from "react"
import { IStateTreeNode, getSnapshot } from "mobx-state-tree"
import { reaction } from "mobx"

function isMSTNode(value: unknown): value is IStateTreeNode {
    return Boolean(value && typeof value === "object" && "toJSON" in value)
}

export function useObservable<T extends IStateTreeNode>(model: T) {
    type SnapshotType = ReturnType<typeof getSnapshot<T>>

    const [state, setState] = useState<Record<string | symbol, unknown>>({})

    useEffect(() => {
        if (!model) return

        const disposers: ReturnType<typeof reaction>[] = []

        // Set up reaction for each property
        Object.keys(state).forEach(prop => {
            const disposer = reaction(
                () => {
                    const value = model[prop as keyof T]
                    if (isMSTNode(value)) {
                        // Handle nested properties
                        const nested = {} as Record<string, unknown>
                        Object.keys(state)
                            .filter(key => key.startsWith(`${prop}.`))
                            .forEach(key => {
                                const nestedProp = key.split(".")[1]
                                nested[nestedProp] = value[nestedProp as keyof typeof value]
                            })
                        return { value, ...nested }
                    }
                    return value
                },
                newValue => {
                    setState(prev => ({
                        ...prev,
                        // @ts-expect-error - need to figure out some of this weird typing
                        [prop]: isMSTNode(newValue) ? newValue.value : newValue
                    }))
                },
                { fireImmediately: true }
            )
            disposers.push(disposer)
        })

        return () => disposers.forEach(d => d())
    }, [model, Object.keys(state).join(",")])

    return new Proxy({} as SnapshotType, {
        get: (_, property: string | symbol) => {
            // Initialize tracking for new properties
            if (!(property in state)) {
                const value = model[property as keyof T]

                setState(prev => ({
                    ...prev,
                    [property]: value
                }))

                if (typeof value === "function") {
                    return value.bind(model)
                }

                if (isMSTNode(value)) {
                    return new Proxy({} as SnapshotType, {
                        get: (_, nestedProp: string | symbol) => {
                            const nestedValue = value[nestedProp as keyof typeof value]

                            if (typeof nestedValue === "function") {
                                return nestedValue.bind(value)
                            }

                            // Track nested property
                            const fullProp = `${String(property)}.${String(nestedProp)}`
                            if (!(fullProp in state)) {
                                setState(prev => ({
                                    ...prev,
                                    [fullProp]: nestedValue
                                }))
                            }

                            return nestedValue
                        }
                    })
                }

                return value
            }

            const value = model[property as keyof T]

            if (typeof value === "function") {
                return value.bind(model)
            }

            if (isMSTNode(value)) {
                return new Proxy({} as SnapshotType, {
                    get: (_, nestedProp: string | symbol) => {
                        const nestedValue = value[nestedProp as keyof typeof value]

                        if (typeof nestedValue === "function") {
                            return nestedValue.bind(value)
                        }

                        const fullProp = `${String(property)}.${String(nestedProp)}`
                        return state[fullProp] ?? nestedValue
                    }
                })
            }

            return state[property] ?? value
        }
    })
}
