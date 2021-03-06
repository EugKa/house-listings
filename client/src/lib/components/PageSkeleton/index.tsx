import { Skeleton } from 'antd'
import React, { Fragment } from 'react'


export const PageSkeleton = () => {
    const skeletonParagraph = (
        <Skeleton
            avatar
            paragraph={{rows: 4}}
            className="page-skeleton__paragraph"
        />
    )
    return (
        <Fragment>
            {skeletonParagraph}
            {skeletonParagraph}
            {skeletonParagraph}
        </Fragment>
    )
}
