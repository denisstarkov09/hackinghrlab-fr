import { handleActions } from "redux-actions";
import { convertToLocalTime} from "utils/format";

// Action Type Imports
import { constants as speakerConstans } from "redux/actions/speaker-actions";
import { Map } from "immutable";

export const reducers = {
    [speakerConstans.UPDATE_PANEL_SPEAKERS]: (state, { payload }) => {
      const {panelsSpeakers, filters} = payload

      let arrayFixed = []
      let num = -1
      let titlesDateReady

      let panelsSpeakersFilters = panelsSpeakers

      if(panelsSpeakers?.panelsSpeakers !== undefined){

        const arrayOrderTime = panelsSpeakers.panelsSpeakers.sort((a,b) => {

          let aTime = convertToLocalTime(a.startDate,a.timeZone).format("YYYY")
          let bTime = convertToLocalTime(b.startDate,b.timeZone).format("YYYY")

          let aTimeRest = convertToLocalTime(a.startDate,a.timeZone).format("MMDDHHmm")
          let bTimeRest = convertToLocalTime(b.startDate,b.timeZone).format("MMDDHHmm")

          return Number(bTime - bTimeRest) - Number(aTime - aTimeRest)

        })

        for(let i = 0; i < arrayOrderTime.length ; i++ ){
            let dateNow = arrayOrderTime[i].startDate
            let timezone = arrayOrderTime[i].timeZone
            if((titlesDateReady !== convertToLocalTime(dateNow,timezone).format().substring(0,10))){
                titlesDateReady = convertToLocalTime(dateNow,timezone).format().substring(0,10)
                num++
                if(!arrayFixed[num]){
                  arrayFixed.push([])
                }
                arrayFixed[num].push(arrayOrderTime[i])
            }else{
              arrayFixed[num].push(arrayOrderTime[i])
            }
            
        }
      }

      const searchNumber = (panel) => {
        let members = panel?.filter((member) => 
          member?.isModerator === false
        )

        return members?.length
      }

      if(filters?.topics !== undefined && panelsSpeakers !== undefined && panelsSpeakersFilters?.panelsSpeakers !== undefined){
        panelsSpeakersFilters.panelsSpeakers = (filters.bul) ? 
          panelsSpeakers?.panelsSpeakers?.filter((panel) => 
            searchNumber(panel?.SpeakerMemberPanels) < 5
          ) 
          : panelsSpeakersFilters?.panelsSpeakers

        panelsSpeakersFilters.panelsSpeakers = (filters?.topics?.length > 0 && filters?.topics !== undefined) ?
          panelsSpeakersFilters?.panelsSpeakers?.filter((tabPanel) => 
              tabPanel?.category?.some(category => filters?.topics?.includes(category))
          )   
          : panelsSpeakersFilters?.panelsSpeakers
      }

      return state.merge({
        allPanelSpeakers: panelsSpeakersFilters,
        allPanelSpeakersFormat: arrayFixed,
      });
    },
    [speakerConstans.UPDATE_USERS_SPEAKERS]: (state, { payload }) => {
      const {userSpeakers} = payload
      
      return state.merge({
        allUserSpeakers: userSpeakers,
      })
    },
    [speakerConstans.UPDATE_ALL_PANELS_OF_ONE_USER]: (state, {payload}) => {
      const {userSpeakers} = payload

      let arrayFixed= []
      let num = -1
      let titlesDateReady

      if(userSpeakers !== undefined){
        const arrayOrderTime = userSpeakers.sort((a,b) => {

          let aTime = convertToLocalTime(a.startDate,a.timeZone).format("YYYY")
          let bTime = convertToLocalTime(b.startDate,b.timeZone).format("YYYY")

          let aTimeRest = convertToLocalTime(a.startDate,a.timeZone).format("MMDDHHmm")
          let bTimeRest = convertToLocalTime(b.startDate,b.timeZone).format("MMDDHHmm")

          return Number(bTime - bTimeRest) - Number(aTime - aTimeRest)

        })

        for(let i = 0; i < arrayOrderTime.length ; i++ ){
          let dateNow = arrayOrderTime[i].startDate
          let timezone = arrayOrderTime[i].timeZone
          if((titlesDateReady !== convertToLocalTime(dateNow,timezone).format().substring(0,10))){
              titlesDateReady = convertToLocalTime(dateNow,timezone).format().substring(0,10)
              num++
              arrayFixed.push([])
              arrayFixed[num].push(arrayOrderTime[i])
          }else{
            arrayFixed[num].push(arrayOrderTime[i])
          }
        }
      }
    
      return state.merge({
        allPanelsOfOneUser: userSpeakers,
        allPanelsOfOneUserFormat: arrayFixed
      })
    },
    [speakerConstans.MY_PANELS_USER_UPDATE]: (state, {payload}) => {
      const {userSpeakers} = payload
    
      return state.merge({
        allMyPanels: userSpeakers,
      })
    },
    [speakerConstans.SET_BUL_REGISTER]: (state, {payload}) => {
      const {bul} = payload
      
      return state.merge({
        bulRegister: bul
      })
    },
    [speakerConstans.SET_ACTIVE_BUTTON]: (state, {payload}) => {
      const {bul} = payload
      
      return state.merge({
        activeButton: bul
      })
    },
    [speakerConstans.UPDATE_ALL_SPONSOR_2023]: (state, {payload}) => {
      const {sponsor} = payload

      return state.merge({
        allSponsors: sponsor,
      })
    }, 
    [speakerConstans.UPDATE_PARRAF]: (state, {payload}) => {
      const {parraf} = payload

      return state.merge({
        allParrafs: parraf.parraf,
      })
    }, 
    [speakerConstans.SET_SPEAKER_MEMBER]: (state, {payload}) => {
      const {member} = payload

      return state.merge({
        allMember: member.member,
      })
    },
  };
  
  export const initialState = () =>
    Map({
        allPanelSpeakers: [],
        allUserSpeakers: [],
        bulRegister: false,
        allSponsors: [],
        activeButton: false,
        allParrafs: [],
        allPanelsOfOneUserFormat: [],
        allPanelsOfOneUser: [],
        allPanelSpeakersFormat: [],
        allMember: [],
        allMyPanels: [],
    }
  );

  export default handleActions(reducers, initialState());
  