import React from "react";

import Conference2023Home from "./Conference2023Home";
import Conference2023Agenda from "./Conference2023Agenda";
import Conference2023Speakers from "./Conference2023Speakers";
import Conference2023Highlights from "./Conference2023Highlights";
import MessagesGeneral from "./MessagesGeneral";
import { INTERNAL_LINKS } from "enum";
import { Redirect, Route } from "react-router-dom";

const Conference2023 = ({ match }) => {
  const {url} = match

  return (
    <>
      <MessagesGeneral />
        {url === INTERNAL_LINKS.CONFERENCE_2023 &&
          <Route 
            path={`${INTERNAL_LINKS.CONFERENCE_2023}`}
            exact
            render={(props) => <Conference2023Home {...props} />}
          />
        }
        {url === `${INTERNAL_LINKS.CONFERENCE_2023}/highlights` &&
          <Route 
            path={`${INTERNAL_LINKS.CONFERENCE_2023}/highlights`}
            exact
            render={(props) => <Conference2023Highlights {...props} />}
          />
        }
        {url === `${INTERNAL_LINKS.CONFERENCE_2023}/speakers` &&
          <Route 
            path={`${INTERNAL_LINKS.CONFERENCE_2023}/speakers`}
            exact
            render={(props) => <Conference2023Speakers {...props} />}
          />
        }
        {url === `${INTERNAL_LINKS.CONFERENCE_2023}/agenda` &&
          <Route 
            path={`${INTERNAL_LINKS.CONFERENCE_2023}/agenda`}
            exact
            render={(props) => <Conference2023Agenda {...props} />}
          />
        }
        {(url !== `${INTERNAL_LINKS.CONFERENCE_2023}/speakers` && 
          url !== `${INTERNAL_LINKS.CONFERENCE_2023}/agenda` && 
          url !== `${INTERNAL_LINKS.CONFERENCE_2023}/highlights` && 
          url !== INTERNAL_LINKS.CONFERENCE_2023) &&
          <Redirect to={INTERNAL_LINKS.HOME}></Redirect> 
        }
    </>
  );
};

export default Conference2023;
