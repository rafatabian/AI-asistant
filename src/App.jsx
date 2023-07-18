import "./App.css"
import { useState, useEffect } from "react"
import ai from "./assets/ai.jpg"
import aiTiny from "./assets/ai-tiny.jpg"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"


const App = () => {
  const [value, setValue] = useState("")
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)
    const [switc, setSwitc] = useState(false)

    const handleKeyDown = (e) => {
        if(e.key === "Enter"){
            getMessages()
        }
    }

    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle)
        setMessage(null)
        setValue("")
    }

    const createNewChat = () => {
        setMessage(null)
        setValue("")
        setCurrentTitle(null)
    }

    const getMessages = async () => {
        setSwitc(true)
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value
            }),
            headers: {
                "Content-Type" : "application/json"
            }
        }

        try {
            const response = await fetch('https://asistent-45fb86b712b9.herokuapp.com/completions',options)
            const data = await response.json()
            setMessage(data.choices[0].message)
            setSwitc(false)
         } catch(error){
            console.error(error)
        }
    }

    useEffect(() => {
    if(!currentTitle && value && message){
        setCurrentTitle(value)
    }
    if(currentTitle && value && message){
        setPreviousChats(prevChats => (
            [...prevChats, 
                {
                 title: currentTitle,
                 role: "user",
                 content: value
                },
                {
                 title: currentTitle,
                 role: message.role,
                 content: message.content
                }  
        ]))
        setValue("")
    }
    }, [message, currentTitle])

    const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
    const uniqueTitle = Array.from(new Set(previousChats.map(previousChat => previousChat.title )))
    

  return (
    <div className="chatGpt_main_container">

        <section className="sidebar">
            <button onClick={createNewChat}>+ New Chat</button>
            <ul className="history">
              {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
            </ul>
            <nav>
                <p>Made by Fabian</p>
                </nav>
        </section>

        <section className="main">
          {!currentTitle && (
          <>
          <h1>FabiGPT</h1>
          <div className="img_container">
            <LazyLoadImage 
            src={ai}
            placeholderSrc={aiTiny}
            effect="blur"
            alt="ai"/>
          </div>
          </>)}
            <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key={index}>
                <p className="role">{chatMessage.role}</p>
                <p>{chatMessage.content}</p>
            </li>)}
            </ul>
            <div className="bottom-section">
                <div className="input_container">
                    <input 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="search..."
                    onKeyDown={handleKeyDown} 
                    />
                    {!switc
                     ? <div id="submit" onClick={getMessages}>&#10148;</div>
                     : <i className="fa-solid fa-spinner fa-spin-pulse fa-lg" style={{color: "#ffffff5d"}}></i>
                    }
                </div>
                 <p className="info">Free Research Preview. 
            ChatGPT may produce inaccurate information about 
            people, places, or facts. ChatGPT May 24 Version
            </p>
            </div>
           
        </section>
    </div>
  )
}
export default App