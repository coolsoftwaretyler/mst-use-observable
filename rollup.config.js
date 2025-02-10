import babel from '@rollup/plugin-babel';
import typescript from "rollup-plugin-typescript2"

export default {
    input: 'src/index.ts',
    output: [
        {
            file: "dist/index.cjs.js",
            format: "cjs",
            sourcemap: true
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            sourcemap: true
        }
    ],
    // millionjs shows the number of renders
    // unit tests for a components with different types of components
    // unit test:
    // - different models re-render correctly
    // - non-observed don't re-render
    // question: how to validate react compiler?
    // react compiler probably has tests - lets look at them
    // maybe try in new repo in case monorepo is a problem
    external: ["react", "mobx-state-tree", "mobx", "mobx-react-lite"],
    plugins: [
        //// seems not to be running?
        //babel({
        //  include: ['src/**/*', '__tests__/components/**/*'],
        //  babelHelpers: 'bundled',
        //  plugins: [
        //    // try to see if there is a way to error if something is skipped
        //    // want to make sure we run the tests against the compiled code
        //    // there should be some metadata output in the AST that we can verify 
        //    // idea - put a strict flag into the react compiler?
        //    ['babel-plugin-react-compiler', { 
        //        logger: { 
        //            logEvent: (fileName, event) => {
        //                console.log(fileName, event)
        //            }
        //        }, 
        //        panicThreshold: "all_errors" 
        //      }
        //    ], // must run first!
        //  ]
        //}),
        typescript({
            tsconfig: "./tsconfig.json"
        }),
    ]
}
