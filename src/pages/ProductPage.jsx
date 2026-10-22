import { useEffect, useState } from "react";
import { Alert, Breadcrumb, Button, Card, Col, Descriptions, Image, Popconfirm, Row, Space, Spin, Typography, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProduct, getProduct } from "../api";
import { useFavoritesStore } from "../stores/favoritesStore";
import { useCartStore } from "../stores/cartStore";
import styles from "./ProductPage.module.scss";

const { Title, Paragraph, Text } = Typography;

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [error, setError] = useState("");
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const addToCart = useCartStore((state) => state.addToCart);
  const isOwned = JSON.parse(localStorage.getItem("escuelajs-owned-products") || "[]").includes(Number(id));

  useEffect(() => {
    const controller = new AbortController();
    getProduct(id, { signal: controller.signal })
      .then((data) => { if (!controller.signal.aborted) { setProduct(data); setError(""); setLoadedId(id); } })
      .catch(() => { if (!controller.signal.aborted) { setError("Товар не найден или API временно недоступно."); setLoadedId(id); } });
    return () => controller.abort();
  }, [id]);

  if (loadedId !== id) return <div className={styles.loading}><Spin size="large" /></div>;
  if (error || !product) return <div className={styles.page}><Alert type="error" showIcon message={error || "Товар не найден"} /><Button type="primary" className={styles.backButton}><Link to="/products">Вернуться в каталог</Link></Button></div>;

  const favorite = favorites.some((item) => item.id === product.id);
  const images = product.images?.filter(Boolean) || [];
  return <div className={styles.page}>
    <Breadcrumb className={styles.breadcrumbs} items={[
      { title: <Link to="/">Главная</Link> },
      { title: <Link to="/products">Каталог</Link> },
      { title: product.title },
    ]} />
    <Row gutter={[32, 24]}>
      <Col xs={24} md={12}><Card className={styles.imageCard}>{images.length ? <Image src={images[0]} alt={product.title} /> : <Text>Изображение отсутствует</Text>}
        {images.length > 1 && <Space wrap className={styles.gallery}>{images.slice(1, 5).map((image) => <Image key={image} src={image} alt={product.title} width={72} />)}</Space>}
      </Card></Col>
      <Col xs={24} md={12}>
        <Text type="secondary">{product.category?.name}</Text>
        <Title level={2} className={styles.title}>{product.title}</Title>
        <Paragraph className={styles.description}>{product.description}</Paragraph>
        <Card className={styles.infoCard}>
          <Title level={3} className={styles.price}>${Number(product.price).toFixed(2)}</Title>
          <Button type="primary" size="large" block className={styles.buyButton} onClick={() => { addToCart(product); message.success("Товар добавлен в корзину"); }}>Добавить в корзину</Button>
          <Button block onClick={() => toggleFavorite(product)}>{favorite ? "♥ Убрать из избранного" : "♡ В избранное"}</Button>
          {isOwned && <Space direction="vertical" style={{ width: "100%", marginTop: 12 }}>
            <Button block><Link to={`/products/${product.id}/edit`}>Редактировать свой товар</Link></Button>
            <Popconfirm title="Удалить этот товар?" description="Удаляйте только созданные вами товары." onConfirm={async () => {
              try {
                await deleteProduct(product.id);
                const ids = JSON.parse(localStorage.getItem("escuelajs-owned-products") || "[]").filter((ownedId) => ownedId !== product.id);
                localStorage.setItem("escuelajs-owned-products", JSON.stringify(ids));
                navigate("/products");
              } catch { message.error("Не удалось удалить товар"); }
            }}><Button danger block>Удалить мой товар</Button></Popconfirm>
          </Space>}
        </Card>
        <Descriptions bordered size="small" column={1} className={styles.details}>
          <Descriptions.Item label="Категория">{product.category?.name || "Не указана"}</Descriptions.Item>
          <Descriptions.Item label="Артикул">{product.id}</Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  </div>;
}

export default ProductPage;
