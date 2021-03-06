/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.activiti.app.domain.editor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "ACT_DE_MODEL_RELATION")
public class ModelRelation {

  @Id
  @GeneratedValue(generator = "modelRelationIdGenerator")
  @GenericGenerator(name = "modelRelationIdGenerator", strategy = "uuid2")
  @Column(name = "ID", unique = true)
  private String id;

  @Column(name = "PARENT_MODEL_ID")
  private String parentModelId;

  // Only needed for HQL queries. Not using it!
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "PARENT_MODEL_ID", insertable = false, updatable = false)
  private Model parentModel;

  @Column(name = "MODEL_ID")
  private String modelId;

  // Only needed for HQL queries. Not using it!
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "MODEL_ID", insertable = false, updatable = false)
  private Model model;

  @Column(name = "RELATION_TYPE")
  private String type;

  public ModelRelation() {

  }

  public ModelRelation(String parentModelId, String modelId, String type) {
    this.parentModelId = parentModelId;
    this.modelId = modelId;
    this.type = type;
  }

  public String getParentModelId() {
    return parentModelId;
  }

  public void setParentModelId(String parentModelId) {
    this.parentModelId = parentModelId;
  }

  public Model getParentModel() {
    return parentModel;
  }

  public void setParentModel(Model parentModel) {
    this.parentModel = parentModel;
  }

  public String getModelId() {
    return modelId;
  }

  public void setModelId(String modelId) {
    this.modelId = modelId;
  }

  public Model getModel() {
    return model;
  }

  public void setModel(Model model) {
    this.model = model;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}