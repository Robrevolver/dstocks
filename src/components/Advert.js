import React from 'react'
import './Advert.css'

const openLink = () => {
    let url = 'https://yourguru.web.app';
    let win = window.open(url, '_blank');
    win.focus();
  }
  
const Advert = ({showAdvert}) => {     
        return (       
        	<div className = 'advertcontainer'>
                <div className='advertunitrow'>
                   <div className = 'advertunitpicture'>
                        <img src='guru.png' alt="Ask the guru" />
                    </div>
                    <div className = 'advertunittext' onClick={openLink}>
                        <b>Ask your guru!</b> aka <b>#chatGPT</b><br></br>
                        Web app for smartphone and desktop with speech recognition.<br/>
                        <b><u>click and test</u></b>
                    </div>
                    <div>
                        <button className="ui mini icon black basic button" onClick = {showAdvert}>Close
                        </button>
                    </div>
                </div>
            </div>   
        )
      }
  
  export default Advert