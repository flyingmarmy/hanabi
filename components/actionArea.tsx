import React, { useState } from "react";
import Card, { CardContext } from "./card";
import Vignettes from "./vignettes";
import DiscardPile from "./discardPile";
import { useRouter } from "next/router";
import { IHintAction, ICard } from "../game/state";

export const ActionAreaType = {
  PLAYER: "player",
  DISCARD: "discard"
};

const colors = ["red", "yellow", "green", "blue", "white"];
const values = [1, 2, 3, 4, 5];

export default ({ game, player, selectedArea }) => {
  const router = useRouter();
  const { playerId } = router.query;
  const [pendingHint, setPendingHint] = useState({
    type: null,
    value: null
  } as IHintAction);

  const currentPlayer = game.players[game.currentPlayer];
  const isCurrentPlayer = currentPlayer === player;

  if (!selectedArea && isCurrentPlayer) {
    return (
      <div className="ph4 bg-grey bt bg-gray-light b--gray-light pt4 flex-grow-1 f4 fw2 tracked ttu gray">
        <p>-> Your turn!</p>

        <p>- Tap on one of your playmates to give hints</p>
        <p>- Click on one of your cards to withdraw or play</p>
      </div>
    );
  }

  if (!selectedArea) {
    return (
      <div className="ph4 bg-grey bt bg-gray-light b--gray-light pt4 flex-grow-1 f4 fw2 tracked ttu gray">
        It's {currentPlayer.name}'s turn
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.DISCARD) {
    return (
      <div className="pa2 pa4-l bg-gray-light bt b--gray-light flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 gray">
          Discarded cards
        </div>
        <DiscardPile cards={game.discardPile} />
      </div>
    );
  }

  if (selectedArea.type === ActionAreaType.PLAYER) {
    const { player } = selectedArea;

    return (
      <div className="pa2 pa4-l bg-gray-light bt b--gray-light flex flex-column flex-grow-1">
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 gray">
          {player.name}'s game
        </div>
        <div className="flex flex-row pb2">
          {player.hand.map((card, i) => (
            <Card
              key={i}
              card={card}
              hidden={player.id === playerId}
              position={i}
              size="large"
              context={CardContext.OTHER_PLAYER}
              className="ma1"
              hintable={isCardHintable(pendingHint, card)}
            />
          ))}
        </div>
        <div className="flex flex-row pb1 pb2-l f6 f4-l fw2 tracked ttu ml1 mb2 gray">
          Select a hint below
        </div>
        <div className="flex flex-row pb2 ml1">
          <Vignettes
            colors={colors}
            values={values}
            onSelect={action => setPendingHint(action)}
            pendingHint={pendingHint}
          />
          <button className="ba br1 pointer fw2 f6 f4-l tracked ttu ml1 gray">
            Give hint
          </button>
        </div>
      </div>
    );
  }
};

function isCardHintable(hint: IHintAction, card: ICard) {
  if (hint.type === "color") {
    return card.color === hint.value;
  } else {
    return card.number === hint.value;
  }
}