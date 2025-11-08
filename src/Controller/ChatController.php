<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Chat;
use App\Service\Router;
use App\Service\Templating;

class ChatController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $chats = Chat::findAll();
        $html = $templating->render('chat/index.html.php', [
            'chats' => $chats,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestChat, Templating $templating, Router $router): ?string
    {
        if ($requestChat) {
            $chat = Chat::fromArray($requestChat);
            // @todo missing validation
            $chat->save();

            $path = $router->generatePath('chat-index');
            $router->redirect($path);
            return null;
        } else {
            $chat = new Chat();
        }

        $html = $templating->render('chat/create.html.php', [
            'chat' => $chat,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $chatId, ?array $requestChat, Templating $templating, Router $router): ?string
    {
        $chat = Chat::find($chatId);
        if (! $chat) {
            throw new NotFoundException("Missing chat with id $chatId");
        }

        if ($requestChat) {
            $chat->fill($requestChat);
            // @todo missing validation
            $chat->save();

            $path = $router->generatePath('chat-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('chat/edit.html.php', [
            'chat' => $chat,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $chatId, Templating $templating, Router $router): ?string
    {
        $chat = Chat::find($chatId);
        if (! $chat) {
            throw new NotFoundException("Missing chat with id $chatId");
        }

        $html = $templating->render('chat/show.html.php', [
            'chat' => $chat,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $chatId, Router $router): ?string
    {
        $chat = Chat::find($chatId);
        if (! $chat) {
            throw new NotFoundException("Missing chat with id $chatId");
        }

        $chat->delete();
        $path = $router->generatePath('chat-index');
        $router->redirect($path);
        return null;
    }
}
