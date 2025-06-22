import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: "$1 to $50",
    value: "1-50",
  },
  {
    name: "$51 to $100",
    value: "51-100",
  },
  {
    name: "$101 to $200",
    value: "101-200",
  },
  {
    name: "$201 to $500",
    value: "201-500",
  },
  {
    name: "$501 to $1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["Newest first", "Low to High", "High to Low", "Rating"];

export async function generateMetadata(props: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = query && query !== "all" && query.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? query : ""} ${
        isCategorySet ? `: Category ${category}` : ""
      } ${isPriceSet ? `: Price ${price}` : ""} ${
        isRatingSet ? `: Rating ${rating}` : ""
      }`,
    };
  }

  return {
    title: "Search Products",
  };
}

const SearchPage = async (props: {
  searchParams: Promise<{
    query?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    query = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "Newest first",
    page = "1",
  } = await props.searchParams;

  // Construct filter Url
  const getFilterUrl = ({
    cat,
    pr,
    st,
    rt,
    pg,
  }: {
    cat?: string;
    pr?: string;
    st?: string;
    rt?: string;
    pg?: string;
  }) => {
    const params = { query, category, price, rating, sort, page };

    if (cat) params.category = cat;
    if (pr) params.price = pr;
    if (st) params.sort = st;
    if (rt) params.rating = rt;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category Links */}
        <div className="text-xl mb-2 mt-3">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ cat: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${category === x.category && "font-bold"}`}
                  href={getFilterUrl({ cat: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div className="text-xl mb-2 mt-10">Price</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ pr: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${price === p.value && "font-bold"}`}
                  href={getFilterUrl({ pr: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Ratings Links */}
        <div className="text-xl mb-2 mt-10">Customer Ratings</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === "all" && "font-bold"}`}
                href={getFilterUrl({ rt: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${rating === r.toString() && "font-bold"}`}
                  href={getFilterUrl({ rt: `${r}` })}
                >
                  {r > 1 ? `${r} stars & up` : `${r} star & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {(query != "all" && query !== "") ||
            (category != "all" && category !== "") ||
            rating != "all" ||
            price != "all" ? (
              <Button variant="link" asChild>
                <Link href="/search">Clear Filter</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Sort By{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`${sort === s && "font-bold"} mx-2`}
                href={getFilterUrl({ st: s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && <div>No products to display!</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
