import '@/styles/global.scss';
import type { Metadata } from 'next'
import { Josefin_Sans, La_Belle_Aurore, Roboto_Slab } from 'next/font/google'

const josefinSans = Josefin_Sans({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '600'],
    variable: '--font-sub-heading',
})

const laBelleAurore = La_Belle_Aurore({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-heading-title',
})

const robotoSlab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['300', '400'],
    variable: '--font-body',
})

export const metadata: Metadata = {
    title: 'J.L. White',
    description: 'Jeslyn L. White\'s personal developer website, in case you wanted to learn more about her.'
}

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${josefinSans.variable} ${laBelleAurore.variable} ${robotoSlab.variable}`}>
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
                    integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.15.1/devicon.min.css"></link>
            </head>
            <body>{children}</body>
        </html>
    )
}