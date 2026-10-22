import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Col, Empty, Input, Row, Select, Spin, Tag, Typography } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { getCategories, getProducts } from "../api";
import { useFavoritesStore } from "../stores/favoritesStore";
import styles from "./ProductsPage.module.scss";

const { Title, Text } = Typography;
const LIMIT = 12;

function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page")) || 1);
  const title = params.get("title") || "";
  const categoryId = params.get("categoryId") || "";
  const priceMin = params.get("price_min") || "";
  const priceMax = params.get("price_max") || "";
  const sort = params.get("sort") || "default";
  const requestKey = [page, title, categoryId, priceMin, priceMax].join("|");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [result, setResult] = useState(null);
  const loading = result?.key !== requestKey;
  const error = loading ? "" : result?.error || "";
  const currentProducts = loading || error ? [] : result?.products || [];
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ offset: String((page - 1) * LIMIT), limit: String(LIMIT) });
    if (title) query.set("title", title);
    if (categoryId) query.set("categoryId", categoryId);
    if (priceMin) query.set("price_min", priceMin);
    if (priceMax) query.set("price_max", priceMax);
    getProducts(query.toString(), { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) { setProducts(data); setResult({ key: requestKey, products: data, error: "" }); } })
      .catch((requestError) => { if (!controller.signal.aborted) setResult({ key: requestKey, products: [], error: requestError.message }); });
    return () => controller.abort();
  }, [page, title, categoryId, priceMin, priceMax, requestKey]);

  const visibleProducts = useMemo(() => {
    const result = [...products];
    if (sort === "cheap") result.sort((a, b) => a.price - b.price);
    if (sort === "expensive") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, sort]);

  function updateFilter(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.set("page", "1");
    setParams(next);
  }

  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <Text type="secondary">GEeks Shop</Text>
        <Title level={1}>Каталог товаров</Title>
        <Text>Товары загружаются из Escuelajs API. Фильтры сохраняются в адресной строке.</Text>
      </div>
      <div className={styles.filters}>
        <Input.Search allowClear placeholder="Поиск по названию" value={title} onChange={(e) => updateFilter("title", e.target.value)} />
        <Select allowClear placeholder="Категория" value={categoryId || undefined} onChange={(value) => updateFilter("categoryId", value)}>
          {categories.map((item) => <Select.Option key={item.id} value={String(item.id)}>{item.name}</Select.Option>)}
        </Select>
        <Input type="number" placeholder="Цена от" value={priceMin} onChange={(e) => updateFilter("price_min", e.target.value)} />
        <Input type="number" placeholder="Цена до" value={priceMax} onChange={(e) => updateFilter("price_max", e.target.value)} />
        <Select value={sort} onChange={(value) => updateFilter("sort", value)}>
          <Select.Option value="default">По умолчанию</Select.Option>
          <Select.Option value="cheap">Сначала дешевле</Select.Option>
          <Select.Option value="expensive">Сначала дороже</Select.Option>
        </Select>
      </div>
      {error && <Alert type="error" showIcon message="Не удалось загрузить товары" description={error} className={styles.error} />}
      {loading && <div className={styles.loading}><Spin size="large" /></div>}
      {!loading && !error && visibleProducts.length === 0 && <Empty description="Товары не найдены" />}
      {!loading && !error && visibleProducts.length > 0 &&
        <Row gutter={[16, 16]}>
          {visibleProducts.map((product) => {
            const favorite = favorites.some((item) => item.id === product.id);
            return <Col key={product.id} xs={12} sm={8} md={6}>
              <Card hoverable cover={<Link to={`/products/${product.id}`}><img className={styles.productImage} src={product.images?.[0]} alt={product.title} /></Link>}>
                <Tag color="blue">{product.category?.name}</Tag>
                <Link to={`/products/${product.id}`} className={styles.productLink}><Title level={5} ellipsis={{ rows: 2 }}>{product.title}</Title></Link>
                <div className={styles.cardBottom}>
                  <Text strong>${Number(product.price).toFixed(2)}</Text>
                  <Button type="text" aria-label={favorite ? "Убрать из избранного" : "В избранное"} onClick={() => toggleFavorite(product)}>{favorite ? "♥" : "♡"}</Button>
                </div>
              </Card>
            </Col>;
          })}
        </Row>
      }
      {!loading && !error &&
        <div className={styles.pagination}>
          <Button disabled={page <= 1 || loading} onClick={() => updateFilter("page", String(page - 1))}>Назад</Button>
          <Text>Страница {page}</Text>
          <Button disabled={currentProducts.length < LIMIT || loading} onClick={() => updateFilter("page", String(page + 1))}>Дальше</Button>
        </div>
      }
    </div>
  );
}

export default ProductsPage;
