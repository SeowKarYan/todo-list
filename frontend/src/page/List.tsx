import { useState } from "react";
import { Button, Card, Form, Input, List as AntList, Spin, Typography, Alert, Empty, Modal, message, Popconfirm } from "antd";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useAddListMutation, useDeleteListMutation, useGetFullListQuery, useUpdateListMutation } from "../redux/services/listApi";
import { useLogoutMutation } from "../redux/services/authApi";
import { api } from "../redux/services/api";
import type { createListRequest, getListResponse } from "../types/list";

const { Title, Text } = Typography;


const List = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data, isLoading, isError, error } = useGetFullListQuery();
    const [addList, { isLoading: isAdding }] = useAddListMutation();
    const [updateList, { isLoading: isUpdating }] = useUpdateListMutation();
    const [deleteList, { isLoading: isDeleting }] = useDeleteListMutation();
    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingList, setEditingList] = useState<getListResponse | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [form] = Form.useForm<createListRequest>();

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data && typeof error.data.message === "string") {
            if (error.data.message === "Unauthorized") {
                navigate("/");
            }
            return error.data.message;
        }
        if (typeof error === "string") {
            return error;
        }
        return fallback;
    };

    const openAddModal = () => {
        setEditingList(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (item: getListResponse) => {
        setEditingList(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingList(null);
        form.resetFields();
    };

    const onFinish = async (values: createListRequest) => {
        try {
            if (editingList) {
                await updateList({ id: editingList.id, ...values }).unwrap();
                message.success("List updated successfully");
            } else {
                await addList(values).unwrap();
                message.success("List created successfully");
            }
            closeModal();
        } catch (submitError) {
            message.error(getErrorMessage(submitError, editingList ? "Failed to update list." : "Failed to add list."));
        }
    };

    const onDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteList(id).unwrap();
            message.success("List deleted successfully");
        } catch (deleteError) {
            message.error(getErrorMessage(deleteError, "Failed to delete list."));
        } finally {
            setDeletingId(null);
        }
    };

    const onLogout = async () => {
        try {
            await logout().unwrap();
            dispatch(api.util.resetApiState());
            navigate("/");
        } catch (logoutError) {
            message.error(getErrorMessage(logoutError, "Failed to log out."));
        }
    };

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: 24,
                backgroundColor: "#f0f2f5",
            }}
        >
            <Card style={{ width: 640, maxWidth: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>
                        To-do list
                    </Title>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Button type="primary" onClick={openAddModal}>
                            Add list
                        </Button>
                        <Button onClick={onLogout} loading={isLoggingOut}>
                            Logout
                        </Button>
                    </div>
                </div>
                {isLoading && (
                    <div data-testid="list-loading-spinner" style={{ textAlign: "center", padding: 24 }}>
                        <Spin />
                    </div>
                )}
                {isError && <Alert type="error" title={getErrorMessage(error, "Failed to load lists.")} showIcon />}
                {!isLoading && !isError && (
                    <AntList
                        dataSource={data ?? []}
                        locale={{ emptyText: <Empty data-testid="empty-list" description="No lists yet" /> }}
                        renderItem={(item) => (
                            <AntList.Item
                                data-testid="list-items"
                                actions={[
                                    <Button type="link" onClick={() => openEditModal(item)}>
                                        Edit
                                    </Button>,
                                    <Popconfirm
                                        title="Delete this list?"
                                        description="This cannot be undone."
                                        okText="Delete"
                                        cancelText="Cancel"
                                        okButtonProps={{ danger: true, loading: isDeleting && deletingId === item.id }}
                                        onConfirm={() => onDelete(item.id)}
                                    >
                                        <Button type="link" danger loading={isDeleting && deletingId === item.id}>
                                            Delete
                                        </Button>
                                    </Popconfirm>,
                                ]}
                            >
                                <AntList.Item.Meta
                                    title={item.title}
                                    description={
                                        <>
                                            <Text type="secondary">
                                                Updated {new Date(item.updatedAt).toLocaleString()}
                                            </Text>
                                            <div style={{ whiteSpace: 'pre-line' }}>
                                                {item.description}
                                            </div>
                                        </>
                                    }
                                />
                            </AntList.Item>
                        )}
                    />
                )}
            </Card>
            <Modal
                title={editingList ? "Edit list" : "Add list"}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={() => form.submit()}
                okText="Submit"
                cancelText="Cancel"
                confirmLoading={isAdding || isUpdating}
                destroyOnHidden
                afterOpenChange={(open) => {
                    if (open && editingList) {
                        form.setFieldsValue({
                            title: editingList.title,
                            description: editingList.description,
                        });
                    }
                }}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter a title" }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Please enter a description" }]}
                    >
                        <Input.TextArea placeholder="Description" rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default List;
