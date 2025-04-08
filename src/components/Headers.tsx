
import { BiPlus, BiTrash } from "react-icons/bi"


interface Header {
    id: string,
    key: string,
    value: string,
    enabled: boolean
}
const Headers = ({headers,setHeaders}:any) => {


    const updateHeader = (id: string, field: keyof Header, value: string | boolean) => {
        setHeaders(headers.map((header:any) => header.id === id ? {
            ...header, [field]: value
        } : header))
    }
    const removeHeader = (id: string) => {
        setHeaders(headers.filter((header:any) => header.id !== id))
    }

    const addHeader = () => {
        let newId = Math.random().toString(36).substring(0, 6)
        setHeaders([...headers, { id: newId, value: "", key: "", enabled: true }])
        console.log("new id", newId)
    }
    return (
        <div className="space-y-2">
            <div className="text-sm text-muted-foreground mb-2 text-gray-500">Add HTTP headers to your request</div>

            <div className="space-y-2">
                {
                    headers.map((header:any) => {
                        return (
                            <div key={header.id} className="flex items-center gap-2 border border-gray-400">
                                <input
                                    placeholder="Header name"
                                    value={header.key}
                                    onChange={(e) => updateHeader(header.id, "key", e.target.value)}
                                    className="flex-1 border-r-1 p-2 border-gray-400 text-gray-500"
                                />
                                <input
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={(e) => updateHeader(header.id, "value", e.target.value)}
                                    className="flex-1 border-r-1 p-2 border-gray-400 text-gray-500"
                                />
                                <button

                                    onClick={() => removeHeader(header.id)}
                                    className="text-muted-foreground hover:text-destructive p-2 text-gray-500"
                                >
                                    <BiTrash className="h-4 w-4" />
                                    <span className="sr-only">Remove header</span>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
            <button onClick={addHeader} className="cursor-pointer mt-2 flex justify-center items-center border border-gray-400 text-gray-500 p-2 rounded-sm">
                <BiPlus className="mr-2 h-4 w-4" />
                Add Header
            </button>

        </div>
    )
}

export default Headers