import React from "react";

import { ReactComponent as Logo } from "../../assets/images/agenda.svg";
import { ReactComponent as Add } from "../../assets/images/add.svg";
import { ReactComponent as LogOut } from "../../assets/images/log-out.svg";

export default function Header({ handleSignOut, handleShowAddBookmark }) {
  return (
    <nav className="navigation">
      <a className="navigation-title-link" href="/">
        <Logo className="logo header-icon" />
        <h1 className="logo-title">Blink</h1>
      </a>

      <ul className="navigation-list">
        <li className="navigation-item">
          <Add className="header-icon" onClick={handleShowAddBookmark} />
        </li>
        <li className="navigation-item">
          <LogOut className="header-icon" onClick={handleSignOut} />
        </li>
      </ul>
    </nav>
  );
}
