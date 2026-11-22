"use client";

import { useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconArrowUp, IconRefresh } from "@tabler/icons-react";
import styles from "./page.module.css";

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
};

export default function Page() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const sendingRef = useRef(false);
  const requestController = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  useEffect(() => {
    return () => requestController.current?.abort();
  }, []);

  async function sendMessage(value: string = input) {
    const message = value.trim();
    if (!message || sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);
    setError("");
    setInput("");
    setMessages((current) => [
      ...current,
      { id: nextId.current++, role: "user", text: message },
    ]);

    const controller = new AbortController();
    requestController.current = controller;

    try {
      // A rota app/api/chat/route.ts espera { message } no corpo do POST.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Não consegui enviar a mensagem. Tente novamente.");
      }

      // A rota devolve { reply: string }.
      const data: unknown = await response.json();
      if (
        typeof data !== "object" ||
        data === null ||
        !("reply" in data) ||
        typeof data.reply !== "string"
      ) {
        throw new Error("A resposta recebida não está no formato esperado.");
      }

      const reply = data.reply;
      setMessages((current) => [
        ...current,
        { id: nextId.current++, role: "bot", text: reply },
      ]);
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(
          err instanceof Error ? err.message : "Ocorreu um erro ao enviar a mensagem."
        );
      }
    } finally {
      if (!controller.signal.aborted) {
        sendingRef.current = false;
        setIsSending(false);
        requestController.current = null;
      }
    }
  }

  function newConversation() {
    requestController.current?.abort();
    requestController.current = null;
    sendingRef.current = false;
    setMessages([]);
    setInput("");
    setError("");
    setIsSending(false);
  }

  return (
    <main className={styles.page}>
      <Card className={styles.chatCard} withBorder radius="lg" padding={0}>
        <header className={styles.header}>
          <Group gap="sm" wrap="nowrap">
            <Avatar size={42} radius="xl" className={styles.avatar}>
              Z
            </Avatar>
            <Stack gap={1}>
              <Text fw={700} size="md" className={styles.brandName}>
                Zuzu
              </Text>
              <Text size="xs" c="dimmed">
                Chat
              </Text>
            </Stack>
          </Group>

          <Tooltip label="Começar uma nova conversa" withArrow>
            <Button
              size="xs"
              variant="subtle"
              color="gray"
              leftSection={<IconRefresh size={16} />}
              onClick={newConversation}
              className={styles.restartButton}
            >
              Nova conversa
            </Button>
          </Tooltip>
        </header>

        <div
          className={styles.messages}
          role="log"
          aria-label="Mensagens da conversa"
          aria-live="polite"
          aria-relevant="additions"
        >
          {messages.length === 0 && (
            <section className={styles.welcome}>
              <Avatar size={58} radius="xl" className={styles.welcomeAvatar}>
                Z
              </Avatar>
              <Title order={2} className={styles.welcomeTitle}>
                Oi, eu sou o Zuzu.
              </Title>
              <Text size="sm" c="dimmed" className={styles.welcomeText}>
                Mande uma mensagem para começarmos a conversar.
              </Text>
            
            </section>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageRow} ${
                message.role === "user" ? styles.userRow : ""
              }`}
            >
              {message.role === "bot" && (
                <Avatar size={30} radius="xl" className={styles.messageAvatar}>
                  Z
                </Avatar>
              )}
              <Paper
                className={`${styles.bubble} ${
                  message.role === "user" ? styles.userBubble : styles.botBubble
                }`}
                radius="md"
                p="sm"
              >
                <Text size="sm" className={styles.messageText}>
                  {message.text}
                </Text>
              </Paper>
            </div>
          ))}

          {isSending && (
            <div className={styles.messageRow} aria-label="Zuzu está respondendo">
              <Avatar size={30} radius="xl" className={styles.messageAvatar}>
                Z
              </Avatar>
              <Paper className={`${styles.bubble} ${styles.botBubble}`} p="sm" radius="md">
                <Group gap="xs">
                  <Loader size="xs" color="pink" type="dots" />
                  <Text size="xs" c="dimmed">
                    Digitando...
                  </Text>
                </Group>
              </Paper>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <footer className={styles.footer}>
          {error && (
            <Text role="alert" size="xs" c="red" mb="xs">
              {error}
            </Text>
          )}
          <form
            className={styles.composer}
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <Textarea
              className={styles.textarea}
              classNames={{ input: styles.textareaInput }}
              aria-label="Digite uma mensagem"
              placeholder="Digite uma mensagem..."
              variant="unstyled"
              autosize
              minRows={1}
              maxRows={5}
              maxLength={500}
              value={input}
              onChange={(event) => setInput(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void sendMessage();
                }
              }}
            />
            <Tooltip label="Enviar" withArrow>
              <ActionIcon
                type="submit"
                aria-label="Enviar mensagem"
                className={styles.sendButton}
                size={40}
                radius="md"
                loading={isSending}
                disabled={!input.trim() || isSending}
              >
                <IconArrowUp size={20} stroke={2} />
              </ActionIcon>
            </Tooltip>
          </form>
          <Text className={styles.hint} size="xs" c="dimmed" ta="center">
            Enter envia · Shift + Enter quebra a linha
          </Text>
        </footer>
      </Card>
    </main>
  );
}
