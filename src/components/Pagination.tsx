import { useEffect, useState } from 'react'

interface PaginationProps {
    totalItems: number;
    perPage: number
    pageCallback: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({totalItems, pageCallback, perPage}) => {
    const [page, setPage] = useState(0);
    useEffect(() => {
        pageCallback(page)
    }, [page])
	return (<div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
    <div className="w-full  flex items-center justify-between">
        <div className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer mr-3 dark:text-white" onClick={()=> (setPage(0))}>
            <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.1665 4L4.49984 7.33333" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1.1665 4.00002L4.49984 0.666687" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
        <div className="sm:flex hidden w-full">
            {
                Array.from(
                    Array(
                      Math.ceil((totalItems ?? 0) / perPage) || 1
                    ).keys()
                  )
                    .filter((o) =>
                    page - 3 < 0 ? o < 7 : o >= page - 3 && o <= page + 3
                    )
                    .map((i) => (
                        <p key={i + 1} className={page === i ? 'text-sm font-medium leading-none cursor-pointer text-indigo-700 border-t dark:text-white border-indigo-400 pt-3 mr-4 px-2':
                        'text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2 dark:text-white'}
                        onClick={()=> (setPage(i))}
                    >{i + 1}</p>
                    ))
            }
            
        </div>
        <div className="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer dark:text-white" onClick={()=> (setPage((Math.ceil((totalItems ?? 0) / perPage) || 1) - 1))}>
            <svg width={14} height={8} viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.1665 4H12.8332" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 7.33333L12.8333 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.5 0.666687L12.8333 4.00002" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    </div>
</div>)
}

export default Pagination;