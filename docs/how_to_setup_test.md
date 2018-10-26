# React-Redux Testing Tutorial


### Introduction
This blog post is a detailed tutorial for testing **components** and **actions** for React-Redux apps.

The testing framework we are using is [jasmine-enzyme](https://www.npmjs.com/package/jasmine-enzyme). **Jasmine** is an open source testing framework for Javascript. **Enzyme** is a Javascript testing utility for React.

For setting up the test, follow this [tutorial](https://www.npmjs.com/package/jasmine-enzyme).

For running the test, run

```
npm test
```

All the code used in this post can be found on [GitHub](https://github.com/kaleo211/xetro).

### Testing on React Components
The definition of components is "*Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen*".

So for testing on components, we want to test on whether
1. it renders correctly.
2. it has correct response when interacts with users.

We will now write a test for the  component *Barsetting*.
In the setting bar, there are different buttons,

#### Setting up


Since we are using react-redux, we need to mock out Redux store for testing. Install a mock store for testing redux async action creators and middleware.
```
npm install redux-mock-store --save-dev
```
Simply do the following:
```
import configureStore from 'redux-mock-store';

```


### Testing on Actions

