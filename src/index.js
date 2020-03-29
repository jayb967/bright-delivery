import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// ReactDOM.render(
//     <App />,
//   document.getElementById('bright-delivery')
// );

// serviceWorker.unregister();


export default class BrightDel {
  static el;

  static mount({ orgBrightdel, ...props } = {}) {
    const component = <App orgBrightdel={orgBrightdel} {...props} />;

    function doRender() {
      if (BrightDel.el) {
        throw new Error('BrightDel is already mounted, unmount first');
      }
      // const el = document.createElement('div');
      // el.setAttribute('id', 'bright-delivery');
      // el = document.getElementById('bright-delivery')

      // if (parentElement) {
      //   document.querySelector(parentElement).appendChild(el);
      // } else {
      //   document.body.appendChild(el);
      // }

      ReactDOM.render(
        component,
        document.getElementById('bright-delivery')
      );
      BrightDel.el = document.getElementById('bright-delivery');
    }

    if (document.readyState === 'complete') {
      console.log('this is called and ready?')
      doRender();
    } else {
      window.addEventListener('load', () => {
        doRender();
      });
    }
    serviceWorker.unregister()
  }

  static unmount() {
    if (!BrightDel.el) {
      throw new Error('BrightDel is not mounted, mount first');
    }
    ReactDOM.unmountComponentAtNode(BrightDel.el);
    BrightDel.el.parentNode.removeChild(BrightDel.el);
    BrightDel.el = null;
  }
}
