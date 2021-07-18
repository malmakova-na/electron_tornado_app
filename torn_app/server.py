from os import name as os_name
import os
import sys
import json

import tornado
from tornado.ioloop import IOLoop
from tornado.web import RequestHandler, Application
import json


PORT = 5006

CUR_DIR = os.path.dirname(os.path.abspath(__file__))


def get_data(name):
    path = os.path.join(CUR_DIR, "data", name+".json")
    if os.path.exists(path):
        with open(path, "r") as f:
            data = json.load(f)
        return data
    else:
        return None


def save_data(data):
    path = os.path.join(CUR_DIR, "data", str(data["id"])+".json")
    is_exists = False

    if os.path.exists(path):
        print(is_exists)
        is_exists = True
    else:
        with open(path, "w") as f:
            json.dump(data, f)
    
    return is_exists


class PostHandler(RequestHandler):

    def set_default_headers(self):
        self.set_header('Content-Type', 'application/json')
    
    def post(self):
        print(self.request.body)
        data = tornado.escape.json_decode(self.request.body)
        if not ("id" in data or "name" in data or "age" in data):
            self.set_status(400)
            print("bad request")
            self.finish("Bad Request")
        is_exists = save_data(data)
        if is_exists:
            self.set_status(400)
            print("user already exists")
            self.finish("user with this ID already exists")
        self.finish("Suscess: user saved")
        



class GetHandler(RequestHandler):
    def set_default_headers(self):
        self.set_header('Content-Type', 'application/json')

    def get(self):
        id_ = self.get_argument("id", None)
        if id_ is None:
            self.set_status(400)
            self.finish("Please add argument 'id'")

        data = get_data(id_)
        if data is not None:
            response = get_data(id_)
            self.write(response)
        else:
            self.set_status(404)
            self.finish("Data for user {} not found".format(id_))


def make_app():
    return Application([
        (r"/get_data", GetHandler),
        (r"/post_data", PostHandler)
    ])


if __name__ == "__main__":
    app = make_app()
    app.listen(PORT)
    print('Server listening on port ' + str(PORT))
    IOLoop.current().start()