import React, { useEffect, useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";
import {
  createStyles,
  TextInput,
  Title,
  Space,
  Paper,
  Group,
  useMantineTheme,
  Text,
  Button,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { EyeCheck, EyeOff } from "tabler-icons-react";
import socket from "../../app/socket";

const useStyles = createStyles((theme) => ({
  background: {
    backgroundColor: theme.colors.dark[6],
    width: "100vw",
    height: "100vh",
  },
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
  },
}));

function PrivateGame() {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      roomCode: "",
      name: "",
      password: "",
    },
    validationRules: {
      roomCode: (value) => value.trim().length === 16,
      name: (value) => value.trim().length >= 2 && value.trim().length <= 6,

      password: (value) => value !== "",
    },
    errorMessages: {
      roomCode: "room code must be 16 characters.",
      name: "Name must include at least 2 characters and max 6 characters",
      password:
        "You must enter a password if you want to play in a private game",
    },
  });

  useEffect(() => {
    //get socket.io connections ( on joinPrivate -> and navigate to waiting page and error -> display error )
    /*  socket.on("joined_private_game", (roomName) => {
      //localStorage.setItem("roomID", roomID);
      const waitingRoomPath = generatePath("/WaitingRoom/gameroom=:roomName", {
        roomName: roomName,
      });
      navigate(waitingRoomPath);
    }); */

    socket.on("join_error", (error) => {
      setError(error);
    });
    socket.on("join_success", (roomCode) => {
      const waitingRoomPath = generatePath("/WaitingRoom/gameroom=:id", {
        id: roomCode,
      });
      navigate(waitingRoomPath);
    });
  }, [navigate]);

  function handleSubmit(values) {
    const joinInfo = {
      room: values.roomCode,
      name: values.name,
      password: values.password,
    };

    socket.emit("join_room", joinInfo);
  }

  return (
    <div>
      <div className={classes.background}>
        <div className={classes.container}>
          <Paper padding="md" shadow="xs" radius="xl" withBorder>
            <Title
              sx={{
                color: `${theme.colors.blue[6]}`,
                display: "flex",
                justifyContent: "center",
              }}
              order={1}
            >
              Join Private Game
            </Title>
            <Space h="xl" />
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Group position="center" direction="column" grow>
                <TextInput
                  required
                  placeholder="room"
                  label="Room  Code"
                  radius="xl"
                  size="md"
                  {...form.getInputProps("roomCode")}
                />

                <TextInput
                  required
                  placeholder="your name"
                  label="Nickname"
                  radius="xl"
                  size="md"
                  {...form.getInputProps("name")}
                />
                <PasswordInput
                  required
                  label="Game Password"
                  radius="xl"
                  placeholder="Change visibility toggle icon"
                  visibilityToggleIcon={({ reveal, size }) =>
                    reveal ? <EyeOff size={size} /> : <EyeCheck size={size} />
                  }
                  {...form.getInputProps("password")}
                  size="md"
                />
                {error && (
                  <Text weight={500} color="red">
                    {error}
                  </Text>
                )}
              </Group>
              <Space h="xl" />
              <Group position="apart">
                <Button
                  size="md"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Back
                </Button>
                <Button type="submit" size="md">
                  Join
                </Button>
              </Group>
            </form>
          </Paper>
        </div>
      </div>
    </div>
  );
}

export default PrivateGame;
