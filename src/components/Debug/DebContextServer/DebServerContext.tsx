'use client'

import { useRef } from 'react'

import { ScrollArea, Code, Box } from '@mantine/core'

import { DebInfoContextJson } from '../DebContextJson'
import { useAppState } from '@/contexts/AppStateContext'
import { useServerStatus } from '@/contexts/ServerStatusContext'


export default function DebServerContext(props : any) {
    const appValues = useServerStatus()
    const viewport = useRef<HTMLDivElement>(null)

    return (
        <>
            
                <ScrollArea
                mah={300}
                    px={10}
                    type="always"
                    viewportRef={viewport}
                    scrollbarSize={8} {...props}>
                    <Code block>
                        <DebInfoContextJson data={appValues} />
                    </Code>
                </ScrollArea>
            
        </>
    )
}
