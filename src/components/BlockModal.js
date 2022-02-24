import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { blocksState, modalState } from "../atoms";
const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const BlockModal = () => {
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [blocks, setBlocks] = useRecoilState(blocksState);
  const [value, setValue] = useState("");
  const date = modalOpen.id && [
    modalOpen.id.slice(0, 4),
    modalOpen.id.slice(4, 6),
    modalOpen.id.slice(6, 8),
  ];

  const dateFormat = date && new Date(date[0], Number(date[1]) - 1, date[2]);
  const onChangeText = (e) => {
    const {
      target: { value },
    } = e;
    setValue(value);
  };
  const addSchedule = (e) => {
    e.preventDefault();
    let newBlocks;
    if (blocks) {
      newBlocks = { ...blocks };
      if (newBlocks[modalOpen.id]) {
        newBlocks[modalOpen.id] = newBlocks[modalOpen.id].concat([
          { id: Date.now(), content: value },
        ]);
        console.log(newBlocks[modalOpen.id]);
      } else {
        newBlocks = {
          ...blocks,
          [modalOpen.id]: [{ id: Date.now(), content: value }],
        };
      }
    } else {
      newBlocks = {
        [modalOpen.id]: [{ id: Date.now(), content: value }],
      };
    }
    setBlocks(newBlocks);
    setValue("");
  };
  const deleteSchedule = (id) => {
    const newBlocks = { ...blocks };
    newBlocks[modalOpen.id] = newBlocks[modalOpen.id].filter(
      (value) => value.id !== id
    );
    setBlocks(newBlocks);
  };
  return (
    <Modal>
      <Overlay
        onClick={() => setModalOpen({ state: false, id: null })}
      ></Overlay>
      <ModalView>
        <div>
          {dateFormat && (
            <ModalHeader>
              {dateFormat.getMonth() + 1}월 {dateFormat.getDate()}일{" "}
              {DAYS_OF_WEEK[dateFormat.getDay()]}
            </ModalHeader>
          )}

          {modalOpen.id &&
            blocks[modalOpen.id] &&
            blocks[modalOpen.id].map((data, idx) => (
              <ModalBlock key={idx}>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteSchedule(data.id)}
                >
                  ✅
                </span>
                <span style={{ marginLeft: "5px" }}>{data.content}</span>
              </ModalBlock>
            ))}
        </div>
        <form onSubmit={addSchedule}>
          <BlockInput
            onChange={onChangeText}
            value={value}
            placeholder="일정을 입력하세요."
          />
        </form>
      </ModalView>
    </Modal>
  );
};

export default BlockModal;
const Modal = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalView = styled.div`
  position: absolute;
  width: 50vw;
  height: 50vh;
  z-index: 2;
  background-color: whitesmoke;
  border-radius: 10px;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const ModalHeader = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
`;
const Overlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;
const ModalBlock = styled.div`
  flex-direction: row;
  align-items: center;
  background-color: whitesmoke;
  margin-block: 5px;
`;
const BlockInput = styled.input`
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  width: 98%;
  border: none;
  padding: 5px;
  &:focus {
    outline: none;
  }
`;
