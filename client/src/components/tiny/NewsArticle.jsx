export const NewsArticle = ({item}) => {
    return (
        <div className="w-full h-1/4 grid grid-cols-[45%_55%]">
            <div style={{backgroundImage: `url("${item.imageUrl}")`}}
                 className="bg-cover bg-center shadow-xl w-full h-full"/>
            <div className="font-serif text-white text-xl pl-4 grid grid-rows-[40%_40%_20%]">
                <a href={item.url} className="hover:underline cursor-pointer flex items-center">
                    {item.thumbnailTitle}
                </a>
                <div className="flex text-sm text-justify pt-4 text-gray-400">
                    {item.description}
                </div>
                <div className="flex text-md font-mono items-center">
                    BBC News
                </div>
            </div>
        </div>
    )
}