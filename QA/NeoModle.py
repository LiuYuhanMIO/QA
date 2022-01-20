from py2neo import Graph, Node, Relationship, cypher, Path
class Neo4j():
    graph = None
    def __init__(self):
        print("create neo4j class ...")

    def connectDB(self):
        self.graph = Graph("http://localhost:7474", auth=("neo4j", "neo4jneo4j"))

    #根据entity1和关系查找enitty2
    def findOtherEntities(self,entity,relation):
        answer = self.graph.run("MATCH (n1 {title:\"" + str(entity) + "\"})- [rel {type:\""+str(relation)+"\"}] -> (n2) RETURN n1,rel,n2" ).data()
        return answer

    #根据类别查找所有的节点
    def findEntitiesByType(self,type):
        answer = self.graph.run("match (m:"+str(type)+") return m").data()
        return answer
    #根据entity2和关系查找enitty1
    def findOtherEntities2(self,entity,relation):
        answer = self.graph.run("MATCH (n1)- [rel {type:\""+str(relation)+"\"}] -> (n2 {title:\"" + str(entity) + "\"}) RETURN n1,rel,n2" ).data()
        return answer


neo_con = Neo4j()   #预加载neo4j
neo_con.connectDB()
print('neo4j connected!')