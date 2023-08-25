import INTERNAL_LINKS from "./InternalLinks";

import IconHome from "images/icon-home.svg";
import IconLibrary from "images/icon-library.svg";
// import IconMentoring from "images/icon-mentoring.svg";
import IconCalendar from "images/icon-calendar.svg";
// import IconMedal from "images/icon-medal.svg";
import IconReader from "images/icon-reader.svg";
import IconStar from "images/icon-star.svg";
// import IconJourney from "images/icon-learning-journey.svg";
import IconBookmark from "images/icon-bookmark.svg";
import IconHeadsetOutline from "images/icon-headset-outline.svg";
// import IconStoreFrontOutline from "images/icon-storefront-outline.svg";
import IconConferenceVideo from "images/icon-sidebar-video.svg";
import IconTvOutline from "images/icon-tv-outline.svg";
// import IconGlobal from "images/icon-global.svg";
import IconFlask from "images/icon-flask-outline.svg";
import IconBriefcase from "images/icon-briefcase-outline.svg";
// import IconGlobal from "images/icon-global.svg";
import iconBonfire from "images/icon-bonfire.svg";
import gradIcon from 'images/grad.svg'
// import iconSchool from "images/icon-school.svg";

export default {
  TOP_MENUS: [
    {
      label: "Home",
      icon: IconHome,
      url: INTERNAL_LINKS.HOME,
    },
    {
      label: "Events",
      icon: IconCalendar,
      url: INTERNAL_LINKS.EVENTS,
    },
    {
      label: "My Learning",
      icon: gradIcon,
      url: INTERNAL_LINKS.MY_LEARNINGS,
    },
    {
      label: "Blogs",
      icon: IconReader,
      url: INTERNAL_LINKS.BLOGS,
    },
    {
      label: "Talent Marketplace",
      icon: IconBriefcase,
      url: INTERNAL_LINKS.TALENT_MARKETPLACE,
    },
    // {
    //   label: "Global Conference",
    //   icon: IconGlobal,
    //   url: INTERNAL_LINKS.GLOBAL_CONFERENCE,
    // },
    {
      label: "Channels",
      icon: IconTvOutline,
      url: INTERNAL_LINKS.CHANNELS,
    },
    
    {
      label: "ProjectX",
      icon: IconFlask,
      url: INTERNAL_LINKS.PROJECTX,
    },
    // {
    //   label: "Simulation Sprints",
    //   icon: iconSchool,
    //   url: INTERNAL_LINKS.SIMULATION_SPRINTS,
    // },
    {
      label: "Learning Library",
      icon: IconLibrary,
      url: INTERNAL_LINKS.LEARNING_LIBRARY,
    },
    {
      label: "Conference Library",
      icon: IconConferenceVideo,
      url: INTERNAL_LINKS.CONFERENCE_LIBRARY,
    },
    {
      label: "Bonfires",
      icon: iconBonfire,
      url: INTERNAL_LINKS.BONFIRES,
    },
    // {
    //   label: "Classes",
    //   icon: IconMedal,
    //   url: INTERNAL_LINKS.CLASSES,
    // },
    // {
    //   label: "Learning Journeys",
    //   icon: IconJourney,
    //   url: INTERNAL_LINKS.JOURNEY,
    // },
    {
      label: "Podcast",
      icon: IconHeadsetOutline,
      url: INTERNAL_LINKS.PODCAST,
    },
    // {
    //   label: "HR Marketplace",
    //   icon: IconStoreFrontOutline,
    //   url: INTERNAL_LINKS.MARKETPLACE,
    // },
  ],
  BOTTOM_MENUS: [
    {
      label: "Favorites",
      icon: IconStar,
      url: INTERNAL_LINKS.FAVORITES,
    },
    {
      label: "Read later",
      icon: IconBookmark,
      url: INTERNAL_LINKS.READ_LATER,
    },
  ],
};
