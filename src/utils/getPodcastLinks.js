import IconAnchorFm from "images/icon-anchor-fm.svg";
import IconApplePodcast from "images/icon-apple-podcast.svg";
import IconBreakerPodcast from "images/icon-breaker-podcast.svg";
import IconIheartradio from "images/icon-iheartradio.svg";
import IconPocketCasts from "images/icon-pocket-casts.svg";
import IconRadiopublic from "images/icon-radiopublic.svg";
import IconSpotify from "images/icon-spotify.svg";
import IconVimeo from "images/icon-vimeo.svg";
import IconGoogle from "images/icon-google.svg";

const getPodcastLinks = (episode) => {
  let links = [];
  if (episode.vimeoLink) {
    links.push({
      icon: IconVimeo,
      label: "Vimeo",
      link: episode.vimeoLink,
    });
  }
  if (episode.anchorLink) {
    links.push({
      icon: IconAnchorFm,
      label: "Anchor FM",
      link: episode.anchorLink,
    });
  }
  if (episode.appleLink) {
    links.push({
      icon: IconApplePodcast,
      label: "Apple Podcast",
      link: episode.appleLink,
    });
  }
  if (episode.breakerLink) {
    links.push({
      icon: IconBreakerPodcast,
      label: "Breaker",
      link: episode.breakerLink,
    });
  }
  if (episode.pocketLink) {
    links.push({
      icon: IconPocketCasts,
      label: "Pocket Casts",
      link: episode.pocketLink,
    });
  }
  if (episode.radioPublicLink) {
    links.push({
      icon: IconRadiopublic,
      label: "Radio Public",
      link: episode.radioPublicLink,
    });
  }
  if (episode.spotifyLink) {
    links.push({
      icon: IconSpotify,
      label: "Spotify",
      link: episode.spotifyLink,
    });
  }
  if (episode.iHeartRadioLink) {
    links.push({
      icon: IconIheartradio,
      label: "iHeart Radio",
      link: episode.iHeartRadioLink,
    });
  }
  if (episode.googleLink) {
    links.push({
      icon: IconGoogle,
      label: "Google Podcast",
      link: episode.googleLink,
    });
  }
  return links;
};

export default getPodcastLinks;
