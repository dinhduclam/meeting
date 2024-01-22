import { Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function IndexPage() {
  const [roomName, setRoomName] = useState("");

  const changeRoomName = (e : any) => {
    setRoomName(e.target.value)
  }

  const joinRoom = () => {
    console.log(roomName);
    if (roomName) {
        window.location.href = `/join?id=${roomName}`;
        window.localStorage.lastRoom = roomName;
    } else {
        alert('Room name empty!\nPlease pick a room name.');
    }
  }
  return (
    <>
      <Stack direction="row" spacing={2}>
        <TextField id="room-id" label="Room ID" variant="standard" onChange={changeRoomName}/>
        <Button onClick={joinRoom} variant="outlined">Call</Button>
      </Stack>
    </>
  );
}
