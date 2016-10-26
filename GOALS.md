ORGANIZATIONS
* id
* ownerId
* name
* meta

POST /organizations
DELETE /organizations
GET /organizations?filter=&sort=&page=
GET /organizations/{id}

MEMBERS
* organizationId
* userId
* roles

POST /organizations/{id}/members
GET /organizations/{id}/members/{id}/access
DELETE /organizations/{id}/members/{id}

INVITE
* organizationId
* challengeType
* destination
* token

POST /organizations/{id}/members/invite
DELETE /organizations/{id}/members/invite/{id}

1. создавать организацию, у организации всегда есть владелец-юзер
2. на первых порах у одного юзера - одна организация, в каком-то будущем (через 6 мес?) может быть несколько
3. организацию можно удалять
4. можно получать список организаций, при этом фильтруя их по каким-то признакам (тарифный план, активна или нет, например)
6. у организации может быть мемберов, при этом этому мемберу задается определенная роль или массив ролей админом (оунером или мембером с привилегиями оунера) организации
6. организация - ячейка владения в любом другом сервисе, доступ к другим сервисам определяется по некоей функции от текущего юзера + роли в конкретной организации
7. мемберов можно удалять из организации
8. можно высылать приглашения юзерам вступить в организацю
9. можно анулировать приглашение
