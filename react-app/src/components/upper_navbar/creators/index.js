import { a } from "react-router-dom";
import * as classes from "./creators.module.css";
function Creahrefrs() {
  return (
    <div className={classes.outer}>
      <fieldset className={(classes.fieldset, classes.Alex)}>
        <legend className={classes.legend}>Alex Pezzati</legend>
        <ul>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/alex-pezzati"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.linkedin.com/"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a rel="noreferrer" target="_blank" href="https://www.google.com">
              Personal Site
            </a>
          </li>
        </ul>
      </fieldset>
      <fieldset className={(classes.fieldset, classes.Chou)}>
        <legend className={classes.legend}>Chou Fomenky</legend>
        <ul>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/alex-pezzati"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/alex-pezzati/"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a rel="noreferrer" target="_blank" href="https://www.google.com/">
              Personal Site
            </a>
          </li>
        </ul>
      </fieldset>
      <fieldset className={(classes.fieldset, classes.Jamie)}>
        <legend className={classes.legend}>Jamie Kichuk</legend>
        <ul>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/JKLolling"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/jamie-kichuk-45778068/"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a rel="noreferrer" target="_blank" href="https://www.google.com">
              Personal Site
            </a>
          </li>
        </ul>
      </fieldset>
      <fieldset className={(classes.fieldset, classes.Raymond)}>
        <legend className={classes.legend}>Raymond-Arthur May</legend>
        <ul>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/raymondmay95"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.linkedin.com/in/coderay/"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.raymondmay.com"
            >
              Personal Site
            </a>
          </li>
        </ul>
      </fieldset>
    </div>
  );
}

export default Creahrefrs;
