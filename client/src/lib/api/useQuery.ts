import { useState, useEffect, useCallback} from 'react'
import { server } from './server'


interface IState<TData> {
    data: TData | null
    loading: boolean
    error: boolean
}

export const useQuery = <TData = any>(query: string) => {
    const [state, setState] = useState<IState<TData>>({
        data: null,
        loading: false,
        error: false
    })

    const fetch = useCallback(() => {
            const fetchApi = async () => {
                try {
                    setState({data: null, loading: true, error:false})

                    const {data, error} = await server.fetch<TData>({query})
                    
                    if(error && error.length) {
                        throw new Error(error[0].massage)
                    }
                    setState({data, loading: false, error:false})
                } catch (error) {
                    setState({data: null, loading: false, error:true})
                    throw console.error(error)
                }
                
               
            }
            fetchApi()
        },[query])

    useEffect(() => {
        fetch()
    },[fetch])

    return { ...state, refetch: fetch}
}