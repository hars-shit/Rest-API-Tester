"use client"
import 'prismjs/themes/prism.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-json'
import { useEffect, useRef, useState } from "react"
import { FiChevronRight, FiClock, FiSave, FiSend } from "react-icons/fi"
import RequestHistory from "../components/RequestHistory"
import Headers from '../components/Headers';
import { BiTrash } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { TbLogout } from 'react-icons/tb';


export default function ApiTesterUI({ setHasUser }: { setHasUser: React.Dispatch<React.SetStateAction<boolean>> }) {
    const navigate=useNavigate()
    const codeRef = useRef<HTMLElement | null>(null)
    const [activeSideTab, setActiveSideTab] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<string>('params')
    const [url, setUrl] = useState<string>('')
    const [method, setMethod] = useState<string>('GET')
    const [loading, setLoading] = useState<Boolean>(false)
    const [response, setResponse] = useState<any>(null)
    const [status, setStatus] = useState<number | null>(null)
    const [responseTime, setResponseTime] = useState<number | null>(null)
    const [requestBody, setRequestBody] = useState<any>("")
    const [showSideBar, setShowSideBar] = useState<Boolean>(false)
    const[email,setEmail]=useState<string>('')

    // for auth 
    const [authType, setAuthType] = useState<string>('');
    const [bearerToken, setBearerToken] = useState<string>('')
    const [basicAuth, setBasicAuth] = useState<{ username: string, password: string }>({ username: '', password: '' })

    const [headers, setHeaders] = useState<any>([
        { id: Math.random().toString(36).substring(0, 6), value: "application/json", key: "Content-Type", enabled: true },
        { id: Math.random().toString(36).substring(0, 6), value: "application/json", key: "Accept", enabled: true }

    ])
    useEffect(()=>{
        const user=localStorage.getItem('user')
        const res=user ? JSON.parse(user)?.email : null
        setEmail(res)
    },[])
  
    // console.log("headers",headers)
    const handleLogout=()=>{
        localStorage.removeItem('user')
        setHasUser(false)
        navigate("/")
    }
    const [params, setParams] = useState<any>([{
        key: '',
        value: ''
    }])


    const addParam = () => {
        setParams([...params, { key: '', value: '' }])
    }

    const handleParamChange = (index: number, field: 'key' | 'value', value: string) => {
        const updatedParams = [...params];
        updatedParams[index][field] = value
        setParams(updatedParams)
    }

    const removeParam = (index: number) => {
        const res = params.filter((_: any, i: number) => index !== i)
        setParams(res)
    }

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current)
        }
    }, [response]);


    const handleSubmit = async () => {
        if (!url) return
        setLoading(true)
        setResponse(null)
        setResponseTime(null)
        setStatus(null)

        const startTime = Date.now()

        try {
            const filteredHeaders = headers?.reduce((acc: Record<string, string>, header: any) => {
                if (header?.enabled && header?.key) {
                    acc[header.key] = header.value
                }
                return acc;
            }, {})
            if (authType === 'bearer' && bearerToken) {
                filteredHeaders['Authorization'] = `Bearer ${bearerToken}`
            }
            if (authType === 'basic' && basicAuth.username && basicAuth.password) {
                const encoded = btoa(`${basicAuth.username}:${basicAuth.password}`)
                filteredHeaders['Authorization'] = `basic ${encoded}`
            }

            const options: RequestInit = {
                method,
                headers: filteredHeaders
            }
            if (method !== "GET" && method !== "HEAD" && requestBody) {
                options.body = requestBody
            }

            const queryString = params
                .filter((p: any) => p.key.trim() !== '')
                .map((p: any) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
                .join('&');

            const finalUrl = queryString ? `${url}?${queryString}` : url
            // console.log("final url", finalUrl)
            const res = await fetch(finalUrl, options)
            const endTime = Date.now()
            setResponseTime(endTime - startTime)
            setStatus(res?.status)
            let data;
            try {
                data = await res?.json()
            }
            catch {
                data = await res?.text()
            }
            setResponse(data)
        }
        catch (err: any) {
            setResponse({ error: "Failed to fetch. Check the URL and try again." })
        }
        finally {
            setLoading(false)
        }
    }



    return (
        <div className="flex h-screen flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white p-4 ">
                <div className="flex items-center gap-2">
                    <button className="md:hidden" onClick={() => setShowSideBar(pre => !pre)}>
                        <FiChevronRight className="h-5 w-5" />

                    </button>
                    <h1 className="text-xl font-bold">API Tester</h1>
                </div>
                <div className="flex items-center ">
                    <button className="border px-3 py-1 rounded text-sm flex items-center gap-2 cursor-pointer" onClick={handleLogout}>
                       {email ? email : "logout"}
                        <TbLogout className="mr-2 h-4 w-4" />
                    </button>
                </div>
            </header>

            {/* side bar on mobile view  */}
            {showSideBar && (
                <div className="fixed inset-0 z-50 bg-white w-72 shadow-lg p-4 md:hidden">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Sidebar</h2>
                        <button onClick={() => setShowSideBar(false)} className="text-gray-600">
                            ✕
                        </button>
                    </div>

                   

                    <div className="overflow-y-auto h-[calc(100%-100px)]">
                        {activeSideTab && <RequestHistory />}
                    </div>
                </div>
            )}


            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-64 flex-shrink-0 border-r bg-white  md:block">
                  
                    <div className="p-4">
                        {
                            activeSideTab  && <RequestHistory />
                        }
                      
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex flex-1 flex-col overflow-hidden">
                    {/* Request builder */}
                    <div className="border-b bg-white p-4 ">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <select defaultValue={method} onChange={(e) => setMethod(e.target.value)} className="w-full sm:w-32 border rounded px-2 py-1">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                    <option value="PATCH">PATCH</option>
                                    <option value="HEAD">HEAD</option>
                                    <option value="OPTIONS">OPTIONS</option>
                                </select>
                                <div className="flex flex-1 gap-2">
                                    <input
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Enter request URL"
                                        className="flex-1 border px-2 py-1 rounded"
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-1 rounded flex items-center">
                                        {
                                            loading ? "Sending..." :
                                                <>
                                                    <FiSend className="mr-2 h-4 w-4" />
                                                    Send
                                                </>
                                        }
                                    </button>
                                    <button className="border px-2 py-1 rounded cursor-pointer">
                                        <FiSave className="h-4 w-4" />
                                        <span className="sr-only">Save request</span>
                                    </button>
                                </div>
                            </div>

                            {/* Request Tabs */}
                            <div>
                                <div className="flex gap-4 border-b">
                                    <button className={`pb-2 cursor-pointer ${activeTab === 'params' && "border-b-2 font-medium border-blue-600"}`} onClick={() => setActiveTab('params')}>Params</button>
                                    <button className={`pb-2 cursor-pointer  text-muted-foreground  ${activeTab === 'headers' && "border-b-2 font-medium border-blue-600"}`} onClick={() => setActiveTab('headers')}>Headers</button>
                                    <button className={`pb-2 cursor-pointer  text-muted-foreground  ${activeTab === 'body' && "border-b-2 font-medium border-blue-600"}`} onClick={() => setActiveTab('body')}>Body</button>
                                    <button className={`pb-2 cursor-pointer  text-muted-foreground  ${activeTab === 'auth' && "border-b-2 font-medium border-blue-600"}`} onClick={() => setActiveTab('auth')}>Auth</button>
                                </div>

                                {/* for body tab content */}
                                {
                                    activeTab === 'body'
                                    &&
                                    <div className="mt-4">
                                        <select className="w-32 mb-2 border px-2 py-1 rounded">
                                            <option>JSON</option>
                                            <option>XML</option>
                                            <option>Text</option>
                                            <option>HTML</option>
                                        </select>
                                        <textarea
                                            value={requestBody}
                                            onChange={(e) => setRequestBody(e.target.value)}
                                            placeholder="Enter request body"
                                            className="w-full px-2 py-2 font-mono border rounded-sm border-gray-400 text-gray-500"
                                            rows={8}
                                        />
                                    </div>
                                }


                                {/* for header tab content  */}
                                {
                                    activeTab === 'headers'
                                    &&
                                    <div className="mt-4">
                                        <Headers headers={headers} setHeaders={setHeaders} />
                                    </div>
                                }

                                {/* for params tab content  */}
                                {activeTab === 'params' && (
                                    <div className="mt-4 space-y-2">
                                        {params.map((param: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Key"
                                                    className="w-1/2 border px-2 py-1 rounded text-gray-500"
                                                    value={param.key}
                                                    onChange={(e) => handleParamChange(index, 'key', e.target.value)}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    className="w-1/2 border px-2 py-1 rounded text-gray-500"
                                                    value={param.value}
                                                    onChange={(e) => handleParamChange(index, 'value', e.target.value)}
                                                />
                                                <button
                                                    onClick={() => removeParam(index)}
                                                    className="text-gray-500 px-2 py-1 cursor-pointer"
                                                >
                                                    < BiTrash />
                                                </button>
                                            </div>
                                        ))}
                                        <button onClick={addParam} className="p-2 cursor-pointer border rounded-sm border-gray-400 text-gray-500 mt-2 text-sm">
                                            + Add Param
                                        </button>
                                    </div>
                                )}

                                {/* for auth tab content  */}

                                {
                                    activeTab === 'auth' && (
                                        <div className='mt-4 space-y-2'>
                                            <select onChange={(e) => setAuthType(e.target.value)}
                                                className='border px-2 py-1 rounded'
                                                value={authType}
                                            >
                                                <option value="">No Auth</option>
                                                <option value="bearer">Bearer Token</option>
                                                <option value="basic">Basic Auth</option>
                                            </select>

                                            {
                                                authType === 'bearer' && (
                                                    <input type="text"
                                                        placeholder='Enter Bearer Token'
                                                        className='w-full border px-2 py-1 rounded-sm border-gray-400 text-gray-500'
                                                        value={bearerToken}
                                                        onChange={(e) => setBearerToken(e.target.value)}
                                                    />
                                                )
                                            }
                                            {
                                                authType === 'basic' && (
                                                    <div className='space-y-2'>

                                                        <input type="text"
                                                            placeholder='Username'
                                                            className='w-full px-2 py-1 border rounded-sm border-gray-400 text-gray-500'
                                                            value={basicAuth.username}
                                                            onChange={(e) => setBasicAuth({ ...basicAuth, username: e.target.value })}
                                                        />

                                                        <input type="password"
                                                            placeholder='Password'
                                                            className='w-full px-2 py-1 border rounded-sm border-gray-400 text-gray-500'
                                                            value={basicAuth.password}
                                                            onChange={(e) => setBasicAuth({ ...basicAuth, password: e.target.value })}
                                                        />


                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>

                    {/* Response viewer */}
                    <section className="flex flex-1 flex-col overflow-hidden bg-slate-50 ">
                        <div className="flex items-center justify-between border-b bg-white p-4">
                            <h2 className="text-lg font-semibold">Response</h2>
                            <div className="flex items-center gap-4">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Status: {status}</span>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <FiClock className="mr-1 h-3 w-3" />
                                    {responseTime} ms
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-auto p-4">
                            <div className="border rounded p-4 bg-white ">
                                <pre className="whitespace-pre-wrap break-all font-mono text-sm">
                                    {
                                        response ?
                                            typeof response === "object" ?
                                                <code ref={codeRef} className='language-json'>
                                                    {JSON.stringify(response, null, 2)}
                                                </code>
                                                :
                                                <code ref={codeRef} className='language-json'>
                                                    response
                                                </code>
                                            :
                                            loading ? "Loading..."
                                                :
                                                "Send a request to see the response"
                                    }
                                </pre>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
