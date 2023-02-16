import { Box, Container, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Topbar } from "./components/Topbar";

type TState = {
  name: string,
  inicio: string,
  fim: string
}

const initialState: TState[] = [
  // { name: "Código da empresa", inicio: "", fim: "" },
  // { name: "Código do funcionário", inicio: "", fim: "" },
  { name: "PIS", inicio: "24", fim: "34" },
  { name: "Dia", inicio: "11", fim: "12" },
  { name: "Mês", inicio: "13", fim: "14" },
  { name: "Ano", inicio: "15", fim: "18" },
]

function InputItem({ state, utils }: {
  state: TState,
  utils: {
    createState: (name: string, inicio?: string, fim?: string) => TState;
    addState: (state: TState) => void;
    deleteState: (name: string) => void;
    updateState: (state: TState, oldName?: string) => void;
    setStateInFocus: React.Dispatch<React.SetStateAction<string>>;
    stateInFocus: string;
  }
}) {
  return (
    <>
      <Box p={0.5} bgcolor={utils.stateInFocus === state.name ? "#e9e9e9" : "inherit"} borderRadius={1} display={"flex"} justifyContent={"space-between"}>
        <Stack gap={1.5} direction="row" justifyContent={"center"} alignItems="center">
          <IconButton onClick={() => { utils.setStateInFocus(state.name) }}>
            <SearchIcon />
          </IconButton>
          <Typography sx={{ mb: 1 }} >
            {state.name}
          </Typography>
        </Stack>
        <IconButton
          sx={{ height: "35px", width: "35px" }}
          onClick={() => { utils.deleteState(state.name) }}>
          <CloseIcon sx={{ height: "12px", width: "12px" }} />
        </IconButton>
      </Box>
      <Stack gap={1} direction="row">
        <TextField
          fullWidth
          label={"Início"}
          value={state.inicio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const STATE = utils.createState(state.name, e.target.value, state.fim)
            utils.updateState(STATE);
          }}
        />
        <TextField
          fullWidth
          label={"Fim"}
          value={state.fim}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const STATE = utils.createState(state.name, state.inicio, e.target.value)
            utils.updateState(STATE);
          }}
        />
      </Stack>
    </>
  )
}

export default function Ponto() {
  const [text, setText] = useState(
    '0000000413291020210759012878602503b08d\n' +
    '00000004232910202112000128786025030c7d\n' +
    '00000004432910202120000128786025033bae');
  const [parsedText, setParsedText] = useState('');
  const [states, setStates] = useState<TState[]>(initialState);
  const [results, setResults] = useState<string[]>([]);
  const [insertMode, setInsertMode] = useState(false);
  const [insertValue, setInsertValue] = useState("");
  const [stateInFocus, setStateInFocus] = useState("");

  function createState(name: string, inicio: string = "", fim: string = "") {
    return { name: name, inicio: inicio, fim: fim } as TState
  }
  function addState(state: TState) {
    setStates((oldState => [...oldState, state]))
  }
  function deleteState(name: string) {
    setStates((oldState) => oldState.reduce((acum, value) =>
      value.name === name ? acum : [...acum, value]
      , [] as TState[]))
  }
  function updateState(state: TState, oldName: string = "") {
    setStates((oldState) => oldState.map(item => {
      if (oldName === "") {
        return item.name === state.name ? state : item
      } else {
        return item.name === oldName ? state : item
      }
    }))
  }

  const stateUtils = {
    createState: createState,
    addState: addState,
    deleteState: deleteState,
    updateState: updateState,
    setStateInFocus: setStateInFocus,
    stateInFocus: stateInFocus
  }

  useEffect(() => {
    if (text === '') return
    setParsedText(text.split('\n')[0]);
  }, [text])

  useEffect(() => {
    let res: string[] = [];
    states.forEach(state => {
      state.inicio !== state.fim &&
        res.push(`${state.name}: ${parsedText.slice(Number(state.inicio) - 1, Number(state.fim))}`)
    })
    setResults(res);
  }, [states, parsedText])

  return (
    <>

      <Topbar />
      <Container>
        <Stack gap={3} mt={3} mb={3}>
          <Stack gap={1}>
            <Typography variant="h5">
              Insira o texto do arquivo
            </Typography>
            <TextField multiline fullWidth minRows={2}
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }}
            />
          </Stack>
          <Grid spacing={1} container>
            <Grid item xs={4}>
              {states.length > 0 &&
                <Stack gap={1}>
                  {states.map((item, index) =>
                    <InputItem key={item.name + index} state={item} utils={stateUtils} />
                  )}
                </Stack>
              }
              <Box mt={2} display="flex" justifyContent={"center"} >

                {insertMode ?
                  <TextField
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key.toUpperCase() === "ENTER") {
                        const STATE = createState(insertValue);
                        addState(STATE);
                        setInsertMode(false);
                        setInsertValue("");
                      }
                    }}
                    label={"Nome do campo"}
                    value={insertValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setInsertValue(e.target.value);
                    }}
                    autoFocus
                  />
                  :
                  <IconButton
                    onClick={() => {
                      setInsertMode(true)
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                }

              </Box>
            </Grid>
            <Grid item xs={8}>
              <Stack height={1} gap={4}>
                <Typography ml={1}>Leituras</Typography>
                <Paper
                  elevation={1}
                  sx={{ p: 2, minHeight: "calc(100% - 113px)", width: 1 }}
                >
                  {results.map(result => <Typography variant="h6" key={result}>{result}</Typography>)}
                </Paper>
              </Stack>
            </Grid>
          </Grid>
          {parsedText &&
            <Stack gap={1}>
              <Typography width={1} textAlign="center" variant="body1">
                Texto analisado: {parsedText}
              </Typography>

              <Stack direction="row" gap={1}>
                {/* @ts-ignore */}
                {[...parsedText].map((letter, index) => {
                  const focus = states.find((item => item.name === stateInFocus))
                  const isInRange = focus ? (index >= Number(focus.inicio) - 1) && (index < Number(focus.fim)) : false;
                  return <Stack key={`${letter}-${index}`} sx={{ display: 'flex', flexWrap: "wrap" }} >
                    <Typography fontSize={24} sx={{ display: "grid", placeItems: "center", height: "40px" }}><strong>{letter}</strong></Typography >
                    <Typography
                      border={isInRange ? "1px solid #ff1414" : "1px solid #797979"}
                      color={isInRange ? "#ff1414" : "#797979"}
                      sx={{ display: "grid", placeItems: "center", height: "20px", width: "20px", borderRadius: "10px" }}
                      fontSize={isInRange ? 11 : 10}>{index + 1}
                    </Typography>
                  </Stack>
                }
                )}
              </Stack>
            </Stack>}
        </Stack>
      </Container >
    </>
  )
}