interface Body<TVariables> {
    query: string;
    variables?: TVariables
}

interface Error {
    massage: string
}

export const server = {
    fetch: async <TData = any, TVariables = any>(
        body: Body<TVariables>
        ) => {
        const res = await fetch('/api', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if(!res.ok) {
            throw new Error("faled to fetch from server");
            
        }
        return res.json() as Promise<{ data: TData; error: Error[] }>
    }
}