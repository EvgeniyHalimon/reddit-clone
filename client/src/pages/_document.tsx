import Document, { Html, Head, Main, NextScript, DocumentContext} from 'next/document'
const metaSite = 'Floppedit'
class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <Head>
                    <link rel="preconnect" href="https://fonts.gstatic.com" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600&display=swap"
                        rel="stylesheet"
                    />
                    <link 
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                    />
                    <meta property='og:site_name' content={metaSite}/>
                    <meta property='twitter:site' content={metaSite}/>
                    <meta property='og:type' content='summary'/>
                    <meta property='twitter:card' content='website'/>
                    {/* <meta property='og:image' content={process.env.NEXT_PUBLIC_BASE_URL}/> */}
                    <link rel='icon' href="https://play-lh.googleusercontent.com/70v2P2iEq51cg0j6oYMDjVOPOPCGfuYeqJDEn4n27W9BRm-xW-9Pb96k-0Q3c8qPhKUB"/>
                    <title>{metaSite}</title>
                </Head>
                <body className="font-body" style={{backgroundColor : '#DAE0E6'}}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }  
}

export default MyDocument