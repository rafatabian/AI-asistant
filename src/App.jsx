import "./App.css"
import { useState, useEffect } from "react"
import "react-lazy-load-image-component/src/effects/blur.css"
import { GoHistory } from "react-icons/go"
import { AiOutlineUser } from "react-icons/ai"
import { RiRobot2Line } from "react-icons/ri"

const App = () => {
  const [value, setValue] = useState("")
    const [message, setMessage] = useState(null)
    const [previousChats, setPreviousChats] = useState([])
    const [currentTitle, setCurrentTitle] = useState(null)
    const [switc, setSwitc] = useState(false)
    const [hisotrySize, setHistorySize] = useState(true)

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
//
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
            <div className="sidebar_blur">
            <button onClick={createNewChat}>+ New Chat</button>
            <ul className="history">
                <div className="history_title">
                    <GoHistory/>
                    <p>HISTORY</p>
                </div>
              {uniqueTitle?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
            </ul>   
            <nav>
                <p>Made by Fabian</p>
                </nav>
            </div>
        </section>

        <section className="main">
          {!currentTitle && (
          <>
          <h1>Your Personal Assistant</h1>
          </>)}
            <ul className="feed">
            {currentChat?.map((chatMessage, index) => <li key={index} className={chatMessage.role === "user" ? "user_question" : ""}>
                <p className="role">{chatMessage.role === "user" ? <AiOutlineUser /> : <RiRobot2Line className="robot_icon"/>}</p> 
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
                     : <i className="fa-solid fa-spinner fa-spin-pulse fa-lg" style={{color: "#3498DB"}}></i>
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