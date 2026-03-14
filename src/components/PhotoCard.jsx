import { useEffect, useState, useReducer } from "react";
import PhotoGrid from "./PhotoGrid";
import SearchBar from "./SearchBar";
import {favReducer} from "../reducer/favreducer.js"
import { FaHeart, FaRegHeart } from "react-icons/fa";


export default function PhotoCard() {

    const [images, setimages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("")
    const [favorites, dispatch] = useReducer(favReducer, [],
            () => {
                const saved = localStorage.getItem("favorites");
                return saved ? JSON.parse(saved) : [];
            }
        )

        useEffect(() => {
            console.log("Favorites changed:", favorites);
            localStorage.setItem("favorites", JSON.stringify(favorites))
        }, [favorites])

    useEffect(() =>{
        const fetchImage = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("https://picsum.photos/v2/list?limit=30");

                if(!res.ok){
                    throw new Error(`Failed to fetch images, status: ${res.status}`);
                }

                const result = await res.json();
                setimages(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchImage();
    }, []);

    const filteredImages = images.filter((img) => 
        img.author.toLowerCase().includes(search.toLowerCase())
    )



    const toggleFavorite = (img) => {
        dispatch({
            type: "TOGGLE_FAV",
            payload: img,
        })
    }

    // const isFav = (id) => {
    //     return favorites.some((img) => img.id === id)
    // }

    const favIds = new Set(favorites.map(f => f.id))

    const isFav = (id) => favIds.has(id)

    return (
        <>
            <div className="bg-white">

            <p className="text-center mb-4 font-semibold">
                Favorites: {favorites.length}
            </p>

                <SearchBar search={search} setSearch={setSearch} />

                    <div>
                        {/* Loading Spinner */}
                        {loading && (
                            <div className="flex justify-center">
                                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <p className="text-red-500 font-semibold">{error}</p>
                        )}

                        {/* Image */}
                        {!loading && !error && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filteredImages.map((img) =>(
                                <div key={img.id} className="bg-white rounded-lg p-2 relative">
                                    <button 
                                        onClick={() => toggleFavorite(img)}
                                        className="absolute top-3 right-3 text-2xl">
                                        
                                        {isFav(img.id) ? <FaHeart color="red"/> : <FaRegHeart color="white"/>}
                                    </button>
                                    <img 
                                        className="w-full h-60 object-cover rounded"
                                        src={img.download_url}
                                        alt={img.author}
                                    />
                                    <p className="text-base mt-2 text-center font-medium">{img.author}</p>
                                </div>
                            ))}
                        </div>
                        )}                    
                    </div>
            </div>
        </>
    )
}