import Tuits from "../components/tuits/index";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import { findAllTuits} from "../services/tuits-service";
import '@testing-library/jest-dom/extend-expect';
import axios from "axios";
import React from "react";

const MOCKED_USERS = [
  {username: 'allen', password: 'allen123', email: 'allen@wonderland.com', _id: "123"},
  {username: 'bob', password: 'bob123', email: 'bob@mark.com', _id: "234"},
  {username: 'charlie', password: 'charlie123', email: 'charlie@smith.com', _id: "345"}
]
const MOCKED_TUITS = [
  {_id: "101", postedBy: MOCKED_USERS[0], tuit: "allen's tuit"},
  {_id: "202", postedBy: MOCKED_USERS[1], tuit: "bob's tuit"},
  {_id: "203", postedBy: MOCKED_USERS[2], tuit: "charlie's tuit"}
];

test('tuit list renders static tuit array', () => {
  // TODO: implement this
  render(
      <HashRouter>
        <Tuits tuits={MOCKED_TUITS}/>
      </HashRouter>
    );

    const linkElement = screen.getByText(/allen's tuit/i);
    expect(linkElement).toBeInTheDocument();
});

test('tuit list renders async', async () => {
   const tuits = await findAllTuits();
    render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);
    const linkElement = screen.getByText(/Alice's first tuit/i);
    expect(linkElement).toBeInTheDocument();
})

test('tuit list renders mocked', async () => {
  // TODO: implement this
  const mock=jest.spyOn(axios,'get');
    mock.mockImplementation(() =>
      Promise.resolve({data: {tuits: MOCKED_TUITS}}));
    const response = await findAllTuits();
    const tuits = response.tuits;

    render(
      <HashRouter>
        <Tuits tuits={tuits}/>
      </HashRouter>);

    const tuit = screen.getByText(/allen's tuit/i);
    expect(tuit).toBeInTheDocument();
    mock.mockRestore();
});
