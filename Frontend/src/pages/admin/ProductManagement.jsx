import AdminProductList from "../admin/AdminProductList";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../component/Loding";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/host/get-all-product")
      .then((res) => setProducts(res.data.productAllData))
      .catch((err) => console.log(err)).finally(()=> setLoading(false))
  }, []);

  //   const handleEdit = (product) => {
  //     console.log("Edit", product);
  //     // Navigate to edit page or open modal
  //   };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/host/search?q=${search}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchProducts, 300); // wait 300ms
    return () => clearTimeout(debounce); // cleanup
  }, [search]);

  const handleDelete = async (product) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `/api/host/remove-product/${product._id}`
      );
      setProducts(products.filter((p) => p._id !== product._id));
    } catch (err) {
      console.log(err);
    }
  };


  if(loading){
    return <Loading/>
  }
  return (
    <>
    <div className="text-2xl md:text-3xl text-center my-4 font-semibold">Products</div>
    <div className="w-full flex justify-center p-5">
      <input
        type="search"
        className="h-8 lg:h-12 w-[80%] lg:w-[70%] border-1 rounded-xl lg:rounded-2xl px-1 lg:px-8"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
      <AdminProductList
        products={products}
        //   onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </>
  );
}
