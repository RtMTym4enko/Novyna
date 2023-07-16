import React, { Component } from 'react';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);
  }


  render() {
    return (
      <header>
        <h1>Hot News</h1>
      </header>
    );
  }
}
