import { Button, Empty, List, Typography } from "antd";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/cartStore";

const { Title, Text } = Typography;

function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <div style={{ maxWidth: 900, margin: "36px auto", padding: 16 }}>
    <Title level={2}>Корзина</Title>
    {!items.length ? <Empty description="Корзина пуста"><Link to="/products">Перейти в каталог</Link></Empty> : <>
      <List bordered dataSource={items} renderItem={(item) => <List.Item actions={[<Button key="remove" danger type="link" onClick={() => removeFromCart(item.id)}>Убрать</Button>]}>
        <List.Item.Meta title={<Link to={`/products/${item.id}`}>{item.title}</Link>} description={`Количество: ${item.quantity}`} />
        <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
      </List.Item>} />
      <Title level={4}>Итого: ${total.toFixed(2)}</Title>
    </>}
  </div>;
}

export default CartPage;
