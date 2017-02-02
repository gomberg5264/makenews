import RouteLogger from "./RouteLogger";
import AddStoryTitleRoute from "./helpers/AddStoryTitleRoute";
import GetStoryRoute from "./helpers/GetStoryRoute";

export default (app) => {
    app.post("/add-story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /add-story request received. title = %s", request.title);
        new AddStoryTitleRoute(request, response, next).process();
    });

    app.get("/story", (request, response, next) => {
        RouteLogger.instance().info("StoryBoardRoutes:: /story request received");
        new GetStoryRoute(request, response, next).process();
    });
};