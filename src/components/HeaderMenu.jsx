"use client"; 

import React from 'react'
import {headerData} from '../../constants/index.js'
import Link from 'next/link.js'
import { usePathname } from 'next/navigation.js'

const HeaderMenu = () => {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <div className='hidden md:inline-flex w-1/3.5 items-center gap-5 text-sm capitalize font-semibold '>
        {
        headerData.map((item, index)=> (
            <Link href={item.href} key={index} className={`'hover:text-darkColor hoverEffect relative group ${pathname === item.href && "text-darkColor"}`}>{item?.title}
            <span className= {`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-darkColor hoverEffect group-hover:w-1/2 group-hover:left-0 ${pathname === item?.href && "w-1/2"}`} />
            <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-darkColor hoverEffect group-hover:w-1/2 group-hover:right-0 ${pathname === item?.href && "w-1/2"}`} />
            </Link>
        ))
        }
    </div>
  )
}

export default HeaderMenu;