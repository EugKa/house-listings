import React, { FC } from 'react'

interface Props {
    title: string
}

export const Listnings: FC<Props> = (props) => {
    return (
        <div>
            {props.title}
        </div>
    )
}
