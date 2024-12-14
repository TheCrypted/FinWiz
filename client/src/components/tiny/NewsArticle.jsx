export const NewsArticle = () => {
    return (
        <div className="w-full h-1/4 flex">
            <div style={{backgroundImage: `url("https://ichef.bbci.co.uk/ace/standard/1024/cpsprodpb/5c7b/live/8e3b53b0-b9fa-11ef-aff0-072ce821b6ab.jpg.webp")`}}
                 className="bg-cover shadow-xl w-full h-full"/>
            <div className="font-serif text-white text-xl pl-4 grid grid-rows-[40%_40%_20%]">
                <a href="https://www.bbc.com/news/live/c1wq025v421t" className="hover:underline cursor-pointer flex items-center">
                    South Korea's President Yoon suspended after MPs vote to impeach him
                </a>
                <div className="flex text-sm text-justify pt-4 text-gray-400">
                    Thousands of protesters celebrated after the vote, as Yoon is suspended while the prime minister serves as acting president.
                </div>
                <div className="flex text-md font-mono items-center">
                    BBC News
                </div>
            </div>
        </div>
    )
}