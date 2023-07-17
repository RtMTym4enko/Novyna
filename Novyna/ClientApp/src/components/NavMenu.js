import React, { Component } from 'react';
import './NavMenu.css';

export class NavMenu extends Component {

  render() {
    return (
        <header>
            <nav class="navbar bg-body-tertiary">
                <div class="container-fluid">
                    <h1 class="display-1"><i class="bi bi-cup-hot p-2"></i>Hot News</h1>
                </div>
            </nav>
      </header>
    );
  }
}
