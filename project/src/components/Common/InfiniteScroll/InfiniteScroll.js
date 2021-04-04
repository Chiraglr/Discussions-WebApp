import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function range(i, max) {
    return [i,i+1,i+2,i+3,i+4].filter((it) => it<=max);
}

function InfiniteScroll({className, items = [], displayCount, ...props}) {
    const slot = props.match.params.id || 1;
    if(slot<1 || (items.length===0 && slot!==1) || (items.length!==0 && slot>Math.ceil(items.length/5))){
        props.history.replace('/');
    }
    const [page, setPage] = useState(slot);
    let totalPages = items.length/displayCount > Math.floor(items.length/displayCount) ? Math.ceil(items.length/displayCount) : items.length/displayCount;

    return <>
        <div className="d-flex justify-content-center align-items-center">
            {Math.ceil(page/5)!=1 && <FontAwesomeIcon
                onClick={() => setPage(Math.ceil(page/5)*5-5)}
                icon={faChevronLeft}
                className="pointer mb-1"
            />}
                {range(Math.ceil(page/5)*5-4, totalPages).map((it, index) => {
                    return <Link to={`/dashboard/${Math.ceil(page/5)*5-4+index}`} className={`black-text fs-16 mx-2 ${page===it ? 'fw-600' : 'pointer'}`} onClick={() => setPage(it)}>
                        {it}
                    </Link>
                })}
            {Math.ceil(page/5)*5<totalPages && <FontAwesomeIcon
                onClick={() => setPage(Math.ceil(page/5)*5+1)}
                icon={faChevronRight}
                className="pointer mb-1"
            />}
        </div>
        <div className="mt-3">
            {items.slice(page*5-5,page*5)}
        </div>
    </>;
}

export default withRouter(InfiniteScroll);