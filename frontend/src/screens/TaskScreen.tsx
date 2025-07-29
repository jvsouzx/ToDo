import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import axios from "axios";
import {
    Card,
    Text,
    Portal,
    Modal,
    TextInput,
    Button,
    SegmentedButtons,
    IconButton,
    FAB,
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";

interface Task {
    id?: number;
    title: string;
    description?: string;
    status: string;
    due_date?: string;
    priority: number;
}

interface DatePickerParams {
    date: Date | undefined;
}

export default function TaskScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [visible, setVisible] = useState(false);
    const [openDate, setOpenDate] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const API_URL = "http://localhost:8000/tasks";

    const fetchTasks = () => {
        axios
            .get(API_URL)
            .then((res) => setTasks(res.data))
            .catch((err) => console.error("API error:", err));
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const openModal = (task: Task) => {
        setSelectedTask(task);
        setIsNew(false);
        setVisible(true);
    };

    const openNewTaskModal = () => {
        setSelectedTask({
            title: "",
            description: "",
            status: "pending",
            priority: 0,
            due_date: undefined,
        });
        setIsNew(true);
        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        setSelectedTask(null);
    };

    const saveTask = () => {
        if (!selectedTask) return;

        if (isNew) {
            axios
                .post(API_URL, selectedTask)
                .then(() => {
                    closeModal();
                    fetchTasks();
                })
                .catch((err) => console.error("Create error:", err));
        } else {
            axios
                .put(`${API_URL}/${selectedTask.id}`, selectedTask)
                .then(() => {
                    closeModal();
                    fetchTasks();
                })
                .catch((err) => console.error("Update error:", err));
        }
    };

    const confirmDelete = (taskId: number) => {
        if (typeof window !== "undefined" && window.confirm) {
            if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
                deleteTask(taskId);
            }
        } else {
            Alert.alert(
                "Confirmar exclusão",
                "Tem certeza que deseja excluir esta tarefa?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Excluir", style: "destructive", onPress: () => deleteTask(taskId) },
                ]
            );
        }
    };

    const deleteTask = (taskId: number) => {
        axios
            .delete(`${API_URL}/${taskId}`)
            .then(() => fetchTasks())
            .catch((err) => {
                console.error("Delete error:", err);
                Alert.alert("Erro", "Não foi possível deletar a tarefa.");
            });
    };

    return (
        <>
            <ScrollView style={{ padding: 16 }}>
                {tasks.map((task) => (
                    <Card key={task.id} style={{ marginBottom: 10 }}>
                        <Card.Content>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <View>
                                    <Text variant="titleMedium">{task.title}</Text>
                                    <Text variant="bodySmall">
                                        Status: {task.status} | Prioridade: {task.priority}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    <IconButton
                                        icon="pencil-outline"
                                        onPress={() => openModal(task)}
                                    />
                                    <IconButton
                                        icon="trash-can-outline"
                                        onPress={() => confirmDelete(task.id!)}
                                    />
                                </View>
                            </View>

                            {task.due_date && (
                                <Text style={{ marginTop: 4 }}>
                                    Vencimento: {new Date(task.due_date).toLocaleDateString()}
                                </Text>
                            )}
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={{
                        backgroundColor: "#F4F6F5",
                        padding: 20,
                        margin: 16,
                        borderRadius: 12,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    {selectedTask && (
                        <>
                            <TextInput
                                label="Título"
                                value={selectedTask.title}
                                onChangeText={(text) =>
                                    setSelectedTask({ ...selectedTask, title: text })
                                }
                                mode="outlined"
                                style={{ marginBottom: 10, backgroundColor: "#fff" }}
                            />
                            <TextInput
                                label="Descrição"
                                value={selectedTask.description || ""}
                                onChangeText={(text) =>
                                    setSelectedTask({ ...selectedTask, description: text })
                                }
                                multiline
                                mode="outlined"
                                style={{ marginBottom: 10, backgroundColor: "#fff" }}
                            />
                            <TextInput
                                label="Prioridade"
                                keyboardType="numeric"
                                value={String(selectedTask.priority)}
                                onChangeText={(text) =>
                                    setSelectedTask({
                                        ...selectedTask,
                                        priority: parseInt(text) || 0,
                                    })
                                }
                                mode="outlined"
                                style={{ marginBottom: 10, backgroundColor: "#fff" }}
                            />

                            <SegmentedButtons
                                value={selectedTask.status}
                                onValueChange={(value) =>
                                    setSelectedTask({ ...selectedTask, status: value })
                                }
                                buttons={[
                                    { value: "pending", label: "Pendente" },
                                    { value: "on going", label: "Em Execução" },
                                    { value: "done", label: "Concluído" },
                                ]}
                                style={{ marginTop: 10 }}
                                theme={{
                                    colors: {
                                        secondaryContainer: "#C8E6C9",
                                        onSecondaryContainer: "#2E7D32", 
                                    },
                                }}
                            />

                            <Button
                                onPress={() => setOpenDate(true)}
                                style={{ marginTop: 10 }}
                            >
                                Selecionar Data de Vencimento
                            </Button>

                            {selectedTask.due_date && (
                                <Text style={{ marginTop: 4 }}>
                                    Vencimento:{" "}
                                    {new Date(selectedTask.due_date).toLocaleDateString()}
                                </Text>
                            )}

                            <DatePickerModal
                                locale="pt-BR"
                                mode="single"
                                visible={openDate}
                                onDismiss={() => setOpenDate(false)}
                                date={
                                    selectedTask?.due_date
                                        ? new Date(selectedTask.due_date)
                                        : undefined
                                }
                                onConfirm={(params: DatePickerParams) => {
                                    if (selectedTask && params.date) {
                                        setSelectedTask({
                                            ...selectedTask,
                                            due_date: params.date.toISOString(),
                                        });
                                    }
                                    setOpenDate(false);
                                }}
                            />

                            <Button
                                mode="contained"
                                onPress={saveTask}
                                style={{ marginTop: 16, backgroundColor: "#4CAF50" }}
                                textColor="#fff"
                            >
                                Salvar
                            </Button>
                            <Button onPress={closeModal} textColor="#4CAF50">Cancelar</Button>
                        </>
                    )}
                </Modal>
            </Portal>

            <FAB
                icon="plus"
                label="Nova tarefa"
                onPress={openNewTaskModal}
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#4CAF50',
                }}
                color="#fff"
            />
        </>
    );
}
