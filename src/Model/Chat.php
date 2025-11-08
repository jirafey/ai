<?php
namespace App\Model;

use App\Service\Config;

class Chat
{
    private ?int $id = null;
    private ?int $likes = 0;
    private ?string $nick = null;
    private ?string $message = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getLikes(): ?int
    {
        return $this->likes;
    }
    public function setLikes(?int $likes): Chat
    {
        $this->likes = $likes;
        return $this;
    }


    public function setId(?int $id): Chat
    {
        $this->id = $id;

        return $this;
    }

    public function getNick(): ?string
    {
        return $this->nick;
    }

    public function setNick(?string $nick): Chat
    {
        $this->nick = $nick;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): Chat
    {
        $this->message = $message;

        return $this;
    }

    public static function fromArray($array): Chat
    {
        $chat = new self();
        $chat->fill($array);

        return $chat;
    }

    public function fill($array): Chat
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['nick'])) {
            $this->setNick($array['nick']);
        }
        if (isset($array['message'])) {
            $this->setMessage($array['message']);
        }
        if (isset($array['likes'])) {
            $this->setLikes($array['likes']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM chat';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $chats = [];
        $chatsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($chatsArray as $chatArray) {
            $chats[] = self::fromArray($chatArray);
        }

        return $chats;
    }

    public static function find($id): ?Chat
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM chat WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $chatArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $chatArray) {
            return null;
        }
        $chat = Chat::fromArray($chatArray);

        return $chat;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO chat (nick, message, likes) VALUES (:nick, :message, :likes)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'nick' => $this->getNick(),
                'message' => $this->getMessage(),
                'likes' => $this->getLikes() ?? 0,
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE chat SET nick = :nick, message = :message, likes = :likes WHERE id = :id";            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':nick' => $this->getNick(),
                ':message' => $this->getMessage(),
                ':likes' => $this->getLikes(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM chat WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setNick(null);
        $this->setMessage(null);
    }
}
