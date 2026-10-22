import { useEffect, useState } from "react";
import { Alert, Button, Form, Input, InputNumber, Select, Spin, Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProduct, getCategories, getProduct, updateProduct } from "../api";

const { Title } = Typography;
const OWNED_KEY = "escuelajs-owned-products";
const ownedIds = () => JSON.parse(localStorage.getItem(OWNED_KEY) || "[]");

function ProductFormPage({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(editing && ownedIds().includes(Number(id)));
  const [error, setError] = useState("");
  const allowed = !editing || ownedIds().includes(Number(id));

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setError("Не удалось загрузить категории."));
    if (!editing) return;
    if (!ownedIds().includes(Number(id))) return;
    getProduct(id).then((product) => {
      form.setFieldsValue({ ...product, categoryId: product.category?.id, imagesText: (product.images || []).join("\n") });
    }).catch(() => setError("Не удалось загрузить товар.")).finally(() => setLoading(false));
  }, [editing, form, id]);

  async function submit(values) {
    setError("");
    const payload = {
      title: values.title.trim(),
      price: Number(values.price),
      description: values.description.trim(),
      categoryId: Number(values.categoryId),
      images: values.imagesText.split(/[\n,]+/).map((image) => image.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        if (!ownedIds().includes(Number(id))) throw new Error("Можно изменять только созданные вами товары.");
        await updateProduct(id, payload);
        navigate(`/products/${id}`);
      } else {
        const product = await createProduct(payload);
        localStorage.setItem(OWNED_KEY, JSON.stringify([...new Set([...ownedIds(), product.id])]));
        navigate(`/products/${product.id}`);
      }
    } catch (requestError) {
      setError(requestError.message || "Не удалось сохранить товар.");
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}><Spin size="large" /></div>;
  if (!allowed) return <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}><Alert type="warning" showIcon message="Редактировать можно только товары, созданные в этом браузере." /><Button style={{ marginTop: 16 }}><Link to="/products">В каталог</Link></Button></div>;

  return <div style={{ maxWidth: 720, margin: "36px auto", padding: 16 }}>
    <Title level={2}>{editing ? "Редактировать товар" : "Создать товар"}</Title>
    {!editing && <Alert style={{ marginBottom: 16 }} type="info" message="Добавьте свою фамилию в название товара, чтобы потом найти его в общем каталоге." />}
    {error && <Alert style={{ marginBottom: 16 }} type="error" showIcon message={error} />}
    <Form form={form} layout="vertical" onFinish={submit} initialValues={{ imagesText: "" }}>
      <Form.Item name="title" label="Название" rules={[{ required: true, message: "Введите название" }]}><Input /></Form.Item>
      <Form.Item name="price" label="Цена" rules={[{ required: true, message: "Введите цену" }]}><InputNumber min={1} style={{ width: "100%" }} /></Form.Item>
      <Form.Item name="description" label="Описание" rules={[{ required: true, message: "Введите описание" }]}><Input.TextArea rows={4} /></Form.Item>
      <Form.Item name="categoryId" label="Категория" rules={[{ required: true, message: "Выберите категорию" }]}><Select options={categories.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item>
      <Form.Item name="imagesText" label="Ссылки на изображения (каждая с новой строки)" rules={[{ required: true, message: "Добавьте хотя бы одну ссылку" }]}><Input.TextArea rows={3} placeholder="https://example.com/image.jpg" /></Form.Item>
      <Button type="primary" htmlType="submit">{editing ? "Сохранить" : "Создать товар"}</Button>
    </Form>
  </div>;
}

export default ProductFormPage;
