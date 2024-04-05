import { PieceType, Side } from "../Types";
import {
  getAllBishopMoves,
  getAllKingMoves,
  getAllKnightMoves,
  getAllPawnMoves,
  getAllRookMoves,
  getCastlingMoves,
} from "../rules";
import { Pawn } from "./Pawn";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Board {
  pieces: Piece[];
  totalTurns: number;
  winningTeam?: Side;

  constructor(pieces: Piece[], totalTurns: number) {
    this.pieces = pieces;
    this.totalTurns = totalTurns;
  }

  // Get the team whose turn it is
  get currentSide(): Side {
    return this.totalTurns % 2 === 0 ? Side.OPPONENT : Side.ALLY;
  }

  // returns a copy of the board & pieces to update UI with new board
  clone(): Board {
    //Create new array with the pieces of the board by cloning each piece in the board into the new copied board
    return new Board(
      this.pieces.map((piece) => piece.clone()),
      this.totalTurns
    );
  }

  getAllMoves() {
    //Find the possible moves for each piece to render them on the board
    for (const piece of this.pieces) {
      piece.possibleMoves = this.getValidMoves(piece, this.pieces);
    }

    //Getting the casting moves for the king
    for (const king of this.pieces.filter((piece) => piece.isKing)) {
      if (king.possibleMoves === undefined) continue;
      // Add the possible moves by the king to the added castling moves
      king.possibleMoves = [
        ...king.possibleMoves,
        ...getCastlingMoves(king, this.pieces),
      ];
    }

    //Now check all of the current team moves are valid
    this.checkAllMovesKingSafety();

    // Get rid of the possible moves for the side that is not moving
    for (const piece of this.pieces.filter(
      (piece) => piece.side !== this.currentSide
    )) {
      piece.possibleMoves = [];
    }

    // Check for checkmate by determining if the team has no possible moves
    if (
      this.pieces
        .filter((piece) => piece.side === this.currentSide)
        .some(
          (piece) =>
            piece.possibleMoves !== undefined && piece.possibleMoves.length > 0
        )
    )
      return;

    // Set the winning team as the other team has no moves
    this.winningTeam =
      this.currentSide === Side.ALLY ? Side.OPPONENT : Side.ALLY;
  }

  // Loop thru curr team pieces to check validity
  checkAllMovesKingSafety() {
    //Loop thru all curr sides pieces by a filter
    for (const piece of this.pieces.filter(
      (p) => p.side === this.currentSide
    )) {
      if (piece.possibleMoves === undefined) continue;
      // Create a simulated board to simulate all the moves for each piece
      for (const move of piece.possibleMoves) {
        const simulatedBoard = this.clone();

        // Get rid of each piece that in the same position of the move
        // This allows the attacking piece to be captured to combat a check
        simulatedBoard.pieces = simulatedBoard.pieces.filter(
          (piece) => !piece.samePosition(move)
        );

        //Clone each piece by first finding each piece based on position
        // Use ! to mark that pieceClone will be defined
        const pieceClone = simulatedBoard.pieces.find((p) =>
          p.samePiecePosition(piece)
        )!;
        //Now update the clone piece position to match the move
        pieceClone.position = move.clone();

        //Get king with updated position (Also specify that it is not undefined with !)
        const kingClone = simulatedBoard.pieces.find(
          (piece) => piece.isKing && piece.side === simulatedBoard.currentSide
        )!;

        //Get all moves for the enemy pieces
        for (const opponent of simulatedBoard.pieces.filter(
          (p) => p.side !== simulatedBoard.currentSide
        )) {
          opponent.possibleMoves = simulatedBoard.getValidMoves(
            opponent,
            simulatedBoard.pieces
          ); // Pass opponent and boardstate

          // Check validity of moves using the currently updated enemy moves
          // Find the Pawns to check diaganol attacks
          if (opponent.isPawn) {
            //Check x-pos for direction of movement to see if Pawn is threatening king
            if (
              opponent.possibleMoves.some(
                (m) =>
                  m.x !== opponent.position.x &&
                  m.samePosition(kingClone.position)
              )
            ) {
              //Use reference to original king to remove the move as a possible move
              piece.possibleMoves = piece.possibleMoves?.filter(
                (m) => !m.samePosition(move)
              );
            }
          } else {
            // If it is not a pawn, just check all moves made by all other pieces
            if (
              opponent.possibleMoves.some((m) =>
                m.samePosition(kingClone.position)
              )
            ) {
              //Use reference to original king to remove the move as a possible move
              piece.possibleMoves = piece.possibleMoves?.filter(
                (m) => !m.samePosition(move)
              );
            }
          }
        }
      }
    }
  }

  getValidMoves(piece: Piece, boardState: Piece[]): Position[] {
    switch (piece.type) {
      case PieceType.PAWN:
        return getAllPawnMoves(piece, boardState);
      case PieceType.KNIGHT:
        return getAllKnightMoves(piece, boardState);
      case PieceType.BISHOP:
        return getAllBishopMoves(piece, boardState);
      case PieceType.ROOK:
        return getAllRookMoves(piece, boardState);
      case PieceType.QUEEN:
        return [
          ...getAllBishopMoves(piece, boardState),
          ...getAllRookMoves(piece, boardState),
        ];
      case PieceType.KING:
        return getAllKingMoves(piece, boardState);
      default:
        return [];
    }
  }

  makeMove(
    isEnPassantMove: boolean,
    validMove: boolean,
    pieceInPlay: Piece,
    destination: Position
  ): boolean {
    const pawnMovement = pieceInPlay.side === Side.ALLY ? 1 : -1;
    // Get the piece on the tile where the piece is moving to
    const destinationPiece = this.pieces.find((piece) =>
      piece.samePosition(destination)
    );

    // Used for castling moves
    // Check piece is a king, its destination is a rook, and the rook is of the same team as the piece being moved
    if (
      pieceInPlay.isKing &&
      destinationPiece?.isRook &&
      destinationPiece.side === pieceInPlay.side
    ) {
      // Find direction from rook to king by subtracting x-position of rooks position from king
      const direction =
        destinationPiece.position.x - pieceInPlay.position.x > 0 ? 1 : -1;
      const newKingXPos = pieceInPlay.position.x + direction * 2;
      // Pos is right, else left
      // No pieces are being taken so using map and just modify the new array with the new position of the rook and king
      this.pieces = this.pieces.map((piece) => {
        // PieceInPlay will be the king
        if (piece.samePiecePosition(pieceInPlay)) {
          piece.position.x = newKingXPos;
        } else if (piece.samePiecePosition(destinationPiece)) {
          // destinationPiece is the rook
          piece.position.x = newKingXPos - direction;
        }
        return piece;
      });
      this.getAllMoves();
      return true; // Move was valid
    }

    if (isEnPassantMove) {
      this.pieces = this.pieces.reduce((currPieces, piece) => {
        // Check if its the piece moved
        if (piece.samePiecePosition(pieceInPlay)) {
          if (piece.isPawn) (piece as Pawn).enPassant = false;

          // Does not update the reference to pieceInPlay because the piece is being copoed
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.hasMoved = true; // Piece has moved
          currPieces.push(piece); // Push the updated pieces position
        } else if (
          !piece.samePosition(
            new Position(destination.x, destination.y - pawnMovement)
          )
        ) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          currPieces.push(piece); // Push the updated pieces position
        }
        return currPieces;
      }, [] as Piece[]);

      // Update the possible moves inside Referee class
      this.getAllMoves();
    } else if (validMove) {
      this.pieces = this.pieces.reduce((currPieces, piece) => {
        // Piece that we are currently moving
        if (piece.samePiecePosition(pieceInPlay)) {
          //SPECIAL MOVE
          if (piece.isPawn)
            (piece as Pawn).enPassant =
              Math.abs(pieceInPlay.position.y - destination.y) === 2 &&
              piece.type === PieceType.PAWN;
          piece.position.x = destination.x;
          piece.position.y = destination.y;
          piece.hasMoved = true;
          currPieces.push(piece);
        } else if (!piece.samePosition(destination)) {
          if (piece.isPawn) {
            (piece as Pawn).enPassant = false;
          }
          currPieces.push(piece);
        }
        return currPieces;
      }, [] as Piece[]);

      // Update the state with the new array of pieces, reflecting any captures and position changes.
      this.getAllMoves();
    } else {
      // If the move isn't valid, do not update the board state and indicate the move was not successful.
      return false;
    }
    return true; // Move has been made successfully
  }
}
