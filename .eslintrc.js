module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-console": ["error", { allow: ["warn", "error"] }],
        "react/jsx-filename-extension": 0,
        "react/jsx-wrap-multilines": 0,
        "object-curly-newline": 0,
        "react/prop-types": 0,
        "react/destructuring-assignment": 0,
        "react/jsx-no-bind": 0,
        "operator-linebreak": 0,
        "class-methods-use-this": 0,
        "prefer-destructuring": 0,
        "react/sort-comp": 0,
        "no-await-in-loop": 0,
        "arrow-parens": 0,
    }
};